import supertest from 'supertest';
import recommendationFactory from './factories/recommendation.factory.js';
import app from '../src/app.js';
const agent = supertest(app);

beforeEach(async () => {
	await recommendationFactory.deleteAllRecommendations();
});

describe('Recomendation post test suit', () => {
	it('post a new recommendation, should return success', async () => {
		const recomedation = recommendationFactory.createRecommendationData();
		console.log(recomedation);
		const response = await agent.post('/recommendations').send(recomedation);
		const qtdRecommendations =
			await recommendationFactory.countRecommendations();

		expect(response.status).toBe(201);
		expect(qtdRecommendations).toBe(1);
	});

	it('post two new recommendations, should return success', async () => {
		const recomedation = recommendationFactory.createRecommendationData();
		const response = await agent.post('/recommendations').send(recomedation);
		const qtdRecommendations =
			await recommendationFactory.countRecommendations();

		expect(response.status).toBe(201);
		expect(qtdRecommendations).toBe(1);

		const recomedation2 = recommendationFactory.createRecommendationData();
		const response2 = await agent.post('/recommendations').send(recomedation2);
		const qtdRecommendations2 =
			await recommendationFactory.countRecommendations();

		expect(response2.status).toBe(201);
		expect(qtdRecommendations2).toBe(2);
	});

	it('post a new recommendation with invalid youtube link, should return unprocessable entity', async () => {
		const recomedation = recommendationFactory.createRecommendationData();
		recomedation.youtubeLink = 'https://www.youtub.com/watch?v=2G_mWfG0DZE';
		const response = await agent.post('/recommendations').send(recomedation);
		const qtdRecommendations =
			await recommendationFactory.countRecommendations();

		expect(response.status).toBe(422);
		expect(qtdRecommendations).toBe(0);
	});

	it('post a new recommendation with invalid name, should return unprocessable entity', async () => {
		const recomedation = recommendationFactory.createRecommendationData();
		const response = await agent
			.post('/recommendations')
			.send({ ...recomedation, name: 55 });
		const qtdRecommendations =
			await recommendationFactory.countRecommendations();

		expect(response.status).toBe(422);
		expect(qtdRecommendations).toBe(0);
	});
});
