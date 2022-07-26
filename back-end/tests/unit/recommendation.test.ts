import { recommendationService } from '../../src/services/recommendationsService';
import { recommendationRepository } from '../../src/repositories/recommendationRepository';
import { jest } from '@jest/globals';

import recommendationFactory from '../factories/recommendation.factory.js';

jest.mock('../../src/repositories/recommendationRepository');

describe('Recomendation create test suite', () => {
	it('shod post a new recommendation', async () => {
		jest
			.spyOn(recommendationRepository, 'findByName')
			.mockImplementationOnce((): any => {});
		jest
			.spyOn(recommendationRepository, 'create')
			.mockImplementationOnce((): any => {});
		const recommendationData = recommendationFactory.createRecommendationData();
		await recommendationService.insert(recommendationData);
		expect(recommendationRepository.create).toBeCalled();
		expect(recommendationRepository.findByName).toBeCalled();
	});

	it('should dont post a recommendation with a name already in use', async () => {
		const recommendationData = recommendationFactory.createRecommendationData();
		jest
			.spyOn(recommendationRepository, 'findByName')
			.mockImplementationOnce((): any => recommendationData);
		jest
			.spyOn(recommendationRepository, 'create')
			.mockImplementationOnce((): any => {});
		const promise = recommendationService.insert(recommendationData);
		expect(promise).rejects.toEqual({
			type: 'conflict',
			message: 'Recommendations names must be unique',
		});
	});
});

describe('Recommendation upvote test suite', () => {
	it('should upvote a recommendation', async () => {
		const recommendationData = recommendationFactory.recomendationData();
		jest
			.spyOn(recommendationRepository, 'find')
			.mockResolvedValueOnce(recommendationData);
		jest
			.spyOn(recommendationRepository, 'updateScore')
			.mockImplementationOnce((): any => {});
		await recommendationService.upvote(1);
		expect(recommendationRepository.updateScore).toBeCalled();
		expect(recommendationRepository.find).toBeCalled();
	});

	it('given a inexistent recommendation id, should throw an error', async () => {
		jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(null);

		const promise = recommendationService.upvote(1);
		expect(promise).rejects.toEqual({ type: 'not_found', message: '' });
		expect(recommendationRepository.find).toBeCalled();
	});
});

describe('Recommendation downvote test suite', () => {
	jest.clearAllMocks();
	it('should downvote a recommendation', async () => {
		const recommendationData = recommendationFactory.createRecommendationData();

		jest
			.spyOn(recommendationRepository, 'find')
			.mockImplementationOnce((): any => recommendationData);
		jest
			.spyOn(recommendationRepository, 'updateScore')
			.mockImplementationOnce((): any => recommendationData);

		await recommendationService.downvote(1);
		expect(recommendationRepository.find).toBeCalled();
		expect(recommendationRepository.updateScore).toBeCalled();
	});

	it('when the recommendation score is less than -5, should delete the rcommendation', async () => {
		const recommendationData = recommendationFactory.recomendationData(-6);

		jest
			.spyOn(recommendationRepository, 'find')
			.mockResolvedValueOnce(recommendationData);
		jest
			.spyOn(recommendationRepository, 'updateScore')
			.mockResolvedValueOnce(recommendationData);
		jest
			.spyOn(recommendationRepository, 'remove')
			.mockImplementationOnce((): any => {});

		await recommendationService.downvote(1);
		expect(recommendationRepository.find).toBeCalled();
		expect(recommendationRepository.updateScore).toBeCalled();
		expect(recommendationRepository.remove).toBeCalled();
	});

	it('given a inexistent recommendation id, should throw an error', async () => {
		jest
			.spyOn(recommendationRepository, 'find')
			.mockImplementationOnce((): any => {});
		jest
			.spyOn(recommendationRepository, 'updateScore')
			.mockImplementationOnce((): any => {});

		const promise = recommendationService.downvote(1);
		expect(promise).rejects.toEqual({ type: 'not_found', message: '' });
	});
});

describe('Recommendation getAll test suite', () => {
	it('should get all recommendations', async () => {
		jest
			.spyOn(recommendationRepository, 'findAll')
			.mockImplementationOnce((): any => {});
		await recommendationService.get();
		expect(recommendationRepository.findAll).toBeCalled();
	});
});

describe('Recommendation getTop test suite', () => {
	it('should get top recommendations', async () => {
		jest
			.spyOn(recommendationRepository, 'getAmountByScore')
			.mockImplementationOnce((): any => {});
		await recommendationService.getTop(10);
		expect(recommendationRepository.getAmountByScore).toBeCalled();
	});
});

describe('Recommendation get random test suite', () => {
	it('when have no recommendation, should return not found error', async () => {
		jest.spyOn(recommendationRepository, 'findAll').mockResolvedValueOnce([]);
		jest.spyOn(recommendationRepository, 'findAll').mockResolvedValueOnce([]);

		const promise = recommendationService.getRandom();
		expect(promise).rejects.toEqual({ type: 'not_found', message: '' });
	});

	it('when random above 0.7, shoud return 30 percernt of the time a recommendation with a score below 10', async () => {
		const recommendations = [recommendationFactory.recomendationData()];
		jest.spyOn(Math, 'random').mockReturnValueOnce(0.7);
		jest
			.spyOn(recommendationRepository, 'findAll')
			.mockResolvedValueOnce(recommendations);

		const response = await recommendationService.getRandom();
		expect(response.id).toEqual(recommendations[0].id);
	});

	it('when random below 0.7, shoud return 70 percernt of the time a recommendation with a score above 10', async () => {
		const recommendations = [recommendationFactory.recomendationData(11)];
		jest.spyOn(Math, 'random').mockReturnValueOnce(0.6);
		jest
			.spyOn(recommendationRepository, 'findAll')
			.mockResolvedValueOnce(recommendations);

		const response = await recommendationService.getRandom();
		expect(response.id).toEqual(recommendations[0].id);
	});
});
