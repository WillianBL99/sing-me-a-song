import RecommendationFactory from '../factories/recommendation.factory';

const URL = 'http://localhost:3000';

beforeEach(() => {
	cy.deleteAllRecommendations();
});

describe('Home page test suite', () => {
	it('should create a recommendation', () => {
		const recommendationData = RecommendationFactory.getRecommendation(2);
		cy.createRecommendationByInterface(recommendationData);
		cy.contains(recommendationData.name);
	});

	it('should get conflict error when creating a recommendation with the same name', () => {
		const recommendationData = RecommendationFactory.getRecommendation(2);
		cy.createRecommendationByInterface(recommendationData);
		cy.createRecommendationByInterface(recommendationData);

		cy.contains(recommendationData.name);
		cy.on('window:alert', (txt) => {
			expect(txt).to.equal('Error creating recommendation!');
		});
	});

	it('added 4 recommendations should have 4 recommendations', () => {
		const recommendationsData = [
			RecommendationFactory.getRecommendation(1),
			RecommendationFactory.getRecommendation(2),
			RecommendationFactory.getRecommendation(3),
			RecommendationFactory.getRecommendation(4),
		];
		cy.createRecommendationByApi(recommendationsData);

		cy.visit(URL);
		cy.get('[data-test="3"]').contains(recommendationsData[0].name);
	});
});
