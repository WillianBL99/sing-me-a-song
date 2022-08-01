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
		cy.createRecommendationByApi({ linksData: recommendationsData });

		cy.visit(URL);
		cy.contains('[data-test="3"]').should('not.exist');
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

describe('Top page test suite', () => {
	it('shoul on the top page when clicking the top button', () => {
		cy.visit(URL);
		cy.get('[data-test="button-top"]').click();
		cy.url().should('include', '/top');
	});

	it('the recommendations with the righest scores should be in first place', () => {
		const recommendationsData = [
			RecommendationFactory.getRecommendation(1),
			RecommendationFactory.getRecommendation(2),
			RecommendationFactory.getRecommendation(3),
			RecommendationFactory.getRecommendation(4),
		];
		cy.createRecommendationByApi({ linksData: recommendationsData });

		cy.visit(`${URL}/top`);
		cy.intercept('GET', '/recommendations/top/10').as('getRecommendations');
		cy.get('[data-test="3"]').within(() => {
			cy.get('[data-test="up"]').click();
		});
		cy.wait('@getRecommendations');

		cy.visit(`${URL}/top`);
		cy.get('[data-test="0"]').contains(recommendationsData[3].name); // the last recommendation should be in first place
	});

	it('the list of recommendations should be sorted by score', () => {
		const recommendationsData = [
			RecommendationFactory.getRecommendation(1),
			RecommendationFactory.getRecommendation(2),
			RecommendationFactory.getRecommendation(3),
			RecommendationFactory.getRecommendation(4),
		];
		cy.createRecommendationByApi({
			linksData: recommendationsData,
			options: {
				includeScore: true,
			},
		});

		cy.visit(`${URL}/top`);
		cy.get('[data-test="0"]').contains(recommendationsData[3].name); // the last recommendation should be in first place
		cy.get('[data-test="1"]').contains(recommendationsData[2].name); // the second recommendation should be in second place
		cy.get('[data-test="2"]').contains(recommendationsData[1].name); // the third recommendation should be in third place
		cy.get('[data-test="3"]').contains(recommendationsData[0].name); // the fourth recommendation should be in fourth place
	});
});

describe('Random page test suite', () => {
	it('should on the random page when cliking random button', () => {
		cy.visit(URL);

		cy.get('[data-test="button-random"]').click();
		cy.url().should('include', '/random');
	});

	it('should show a recommendation', () => {
		const recommendationData = RecommendationFactory.getRecommendation(4);
		cy.createRecommendationByApi({ linksData: [recommendationData] });

		cy.visit(`${URL}/random`);
		cy.contains(recommendationData.name);
	});
});
