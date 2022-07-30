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
