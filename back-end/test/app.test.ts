import supertest from 'supertest';
import recommendationFactory from './factories/recommendation.factory.js';
import app from '../src/app.js';
const agent = supertest(app);

beforeEach(async () => {
	await recommendationFactory.deleteAllRecommendations();
});

afterAll(async () => {
	await recommendationFactory.deleteAllRecommendations();
});

describe('Recomendation post test suit', () => {
	it('post a new recommendation, should return success', async () => {
		const recommendation = recommendationFactory.createRecommendationData();
		const response = await agent.post('/recommendations').send(recommendation);
		const qtdRecommendations =
			await recommendationFactory.countRecommendations();

		expect(response.status).toBe(201);
		expect(qtdRecommendations).toBe(1);
	});

	it('post two new recommendations, should return success', async () => {
		const recommendation = recommendationFactory.createRecommendationData();
		const response = await agent.post('/recommendations').send(recommendation);
		const qtdRecommendations =
			await recommendationFactory.countRecommendations();

		expect(response.status).toBe(201);
		expect(qtdRecommendations).toBe(1);

		const recommendation2 = recommendationFactory.createRecommendationData();
		const response2 = await agent
			.post('/recommendations')
			.send(recommendation2);
		const qtdRecommendations2 =
			await recommendationFactory.countRecommendations();

		expect(response2.status).toBe(201);
		expect(qtdRecommendations2).toBe(2);
	});

	it('post the same recommendation twice, should return conflict', async () => {
		const recommendation = recommendationFactory.createRecommendationData();
		await agent.post('/recommendations').send(recommendation);
		const response = await agent.post('/recommendations').send(recommendation);

		expect(response.status).toBe(409);
		const findRecommendation =
			await recommendationFactory.getRecommendationByname(recommendation.name);
		expect(findRecommendation).not.toBeNull();
	});

	it('post a new recommendation with invalid youtube link, should return unprocessable entity', async () => {
		const recommendation = recommendationFactory.createRecommendationData();
		recommendation.youtubeLink = 'https://www.youtub.com/watch?v=2G_mWfG0DZE';
		const response = await agent.post('/recommendations').send(recommendation);
		const qtdRecommendations =
			await recommendationFactory.countRecommendations();

		expect(response.status).toBe(422);
		expect(qtdRecommendations).toBe(0);
	});

	it('post a new recommendation with invalid name, should return unprocessable entity', async () => {
		const recommendation = recommendationFactory.createRecommendationData();
		const wrongPostData = {
			name: 555,
			youtubeLink: recommendation.youtubeLink,
		};
		const response = await agent.post('/recommendations').send(wrongPostData);
		const qtdRecommendations =
			await recommendationFactory.countRecommendations();

		expect(response.status).toBe(422);
		expect(qtdRecommendations).toBe(0);
	});
});

describe('Recommendation up vote test suit', () => {
	it('up vote a recommendation, should return success', async () => {
		const recommendation = await recommendationFactory.createRecommendation();
		const response = await agent.post(
			`/recommendations/${recommendation.id}/upvote`
		);

		expect(response.status).toBe(200);
		const recommendationVoted =
			await recommendationFactory.getRecommendationById(recommendation.id);

		expect(recommendationVoted.score).toBe(1);
	});

	it('vote twice on a recommendation, should return success', async () => {
		const recommendation = await recommendationFactory.createRecommendation();
		console.log({ recommendation });
		const response = await agent.post(
			`/recommendations/${recommendation.id}/upvote`
		);
		const response2 = await agent.post(
			`/recommendations/${recommendation.id}/upvote`
		);

		expect(response.status).toBe(200);
		expect(response2.status).toBe(200);
		const recommendationVoted =
			await recommendationFactory.getRecommendationById(recommendation.id);

		expect(recommendationVoted.score).toBe(2);
	});

	it('up vote a invalid recommendation, should return not found', async () => {
		const response = await agent.post('/recommendations/123/upvote');
		const findRecommendation =
			await recommendationFactory.getRecommendationById(123);

		expect(response.status).toBe(404);
		expect(findRecommendation).toBeNull();
	});

	it('pass id as string, should return unprocessable entity', async () => {
		const response = await agent.post('/recommendations/abc/upvote');
		expect(response.status).toBe(422);
	});
});

describe('Recommendation down vote test suit', () => {
	it('down vote a recommendation, should return success', async () => {
		const recommendation = await recommendationFactory.createRecommendation();
		const response = await agent.post(
			`/recommendations/${recommendation.id}/downvote`
		);

		expect(response.status).toBe(200);
		const recommendationVoted =
			await recommendationFactory.getRecommendationById(recommendation.id);

		expect(recommendationVoted.score).toBe(-1);
	});

	it('down vote twice on a recommendation, should return success', async () => {
		const recommendation = await recommendationFactory.createRecommendation();
		const response = await agent.post(
			`/recommendations/${recommendation.id}/downvote`
		);
		const response2 = await agent.post(
			`/recommendations/${recommendation.id}/downvote`
		);

		expect(response.status).toBe(200);
		expect(response2.status).toBe(200);
		const recommendationVoted =
			await recommendationFactory.getRecommendationById(recommendation.id);

		expect(recommendationVoted.score).toBe(-2);
	});

	it('down vote a invalid recommendation, should return not found', async () => {
		const response = await agent.post('/recommendations/123/downvote');
		const findRecommendation =
			await recommendationFactory.getRecommendationById(123);

		expect(response.status).toBe(404);
		expect(findRecommendation).toBeNull();
	});

	it('pass id as string, should return unprocessable entity', async () => {
		const response = await agent.post('/recommendations/abc/downvote');
		expect(response.status).toBe(422);
	});

	it('down vote a recommendation score of -5, should return success and delete the recommendation', async () => {
		const recommendation = await recommendationFactory.createRecommendation();
		await recommendationFactory.setScoreRecommendation(recommendation.id, -5);
		const response = await agent.post(
			`/recommendations/${recommendation.id}/downvote`
		);

		expect(response.status).toBe(200);
		const findRecommendation =
			await recommendationFactory.getRecommendationById(recommendation.id);
		expect(findRecommendation).toBeNull();
	});
});

describe('Recommendation get test suit', () => {
	it('get recommendations, should return ten recommendations', async () => {
		await recommendationFactory.createManyRecommendations(10);
		const recommendations = await recommendationFactory.createRecommendation();
		const response = await agent.get('/recommendations');

		expect(response.status).toBe(200);
		expect(response.body.length).toBe(10);

		expect(response.body[0]?.id).toBeDefined();
		expect(response.body[0].id).not.toBeNaN();
		expect(response.body[0]?.name).toBeDefined();
		expect(response.body[0].name).not.toBeNull();
		expect(response.body[0]?.youtubeLink).toBeDefined();
		expect(response.body[0].youtubeLink).not.toBeNull();
		expect(response.body[0]?.score).toBeDefined();
		expect(response.body[0].score).not.toBeNaN();

		expect(response.body[0].id).toBe(recommendations.id);
	});

	it('get recommendations, should return empty array', async () => {
		const response = await agent.get('/recommendations');

		expect(response.status).toBe(200);
		expect(response.body.length).toBe(0);
	});

	it('get recommendations when there are less than ten recommendations, should reutrn all recommendations', async () => {
		await recommendationFactory.createManyRecommendations(5);
		const response = await agent.get('/recommendations');

		expect(response.status).toBe(200);
		expect(response.body.length).toBe(5);
	});
});
