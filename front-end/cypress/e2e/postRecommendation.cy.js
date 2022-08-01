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

describe('Recommendation upvote test suite', () => {
	it('should upvote a recommendation', () => {
		const recommendationData = RecommendationFactory.getRecommendation(2);
		cy.createRecommendationByApi({ linksData: [recommendationData] });

		cy.visit(URL);
		cy.intercept('POST', '/recommendations/*/upvote').as(
			'upvoteRecommendation'
		);
		cy.get('[data-test="up"]').click();
		cy.wait('@upvoteRecommendation');

		cy.visit(URL);
		cy.get('[data-test="0"]>div:last-child').contains('1');
	});

	it('should upvote a recommendation twice', () => {
		const recommendationData = RecommendationFactory.getRecommendation(2);
		cy.createRecommendationByApi({ linksData: [recommendationData] });

		cy.visit(URL);
		cy.intercept('POST', '/recommendations/*/upvote').as(
			'upvoteRecommendation'
		);
		cy.get('[data-test="up"]').click();
		cy.wait('@upvoteRecommendation');
		cy.get('[data-test="up"]').click();
		cy.wait('@upvoteRecommendation');

		cy.visit(URL);
		cy.get('[data-test="0"]>div:last-child').contains('2');
	});
});

describe('Recommendation downvote test suite', () => {
	it('should downvote a recommendation', () => {
		const recommendationData = RecommendationFactory.getRecommendation(2);
		cy.createRecommendationByApi({ linksData: [recommendationData] });

		cy.visit(URL);
		cy.intercept('POST', '/recommendations/*/downvote').as(
			'downvoteRecommendation'
		);
		cy.get('[data-test="down"]').click();
		cy.wait('@downvoteRecommendation');

		cy.visit(URL);
		cy.get('[data-test="0"]>div:last-child').contains('1');
	});

	it('should downvote a recommendation twice', () => {
		const recommendationData = RecommendationFactory.getRecommendation(2);
		cy.createRecommendationByApi({ linksData: [recommendationData] });

		cy.visit(URL);
		cy.intercept('POST', '/recommendations/*/downvote').as(
			'downvoteRecommendation'
		);
		cy.get('[data-test="down"]').click();
		cy.wait('@downvoteRecommendation');
		cy.get('[data-test="down"]').click();
		cy.wait('@downvoteRecommendation');

		cy.visit(URL);
		cy.get('[data-test="0"]>div:last-child').contains('-2');
	});

	it('should delete a recommendation when downvote for the sixth time', () => {
		const recommendationData = RecommendationFactory.getRecommendation(2);
		cy.createRecommendationByApi({
			linksData: [recommendationData],
			options: { setScore: -5 },
		});

		cy.visit(URL);
		cy.get('[data-test="0"]>div:last-child').contains('-5');

		cy.intercept('POST', '/recommendations/*/downvote').as(
			'downvoteRecommendation'
		);
		cy.get('[data-test="down"]').click();
		cy.wait('@downvoteRecommendation');

		cy.visit(URL);
		cy.contains(recommendationData.name).should('not.exist');
	});
});
