import { conflictError } from '../../src/utils/errorUtils.js';
import { recommendationService } from '../../src/services/recommendationsService';
import { recommendationRepository } from '../../src/repositories/recommendationRepository';
import { jest } from '@jest/globals';

import recommendationFactory from '../factories/recommendation.factory.js';
import { Recommendation } from '@prisma/client';

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
		const recommendationData: Recommendation = {
			id: 1,
			name: 'Recommendation 1',
			youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
			score: 0,
		};
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
