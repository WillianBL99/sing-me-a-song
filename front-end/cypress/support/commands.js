// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const APP_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:5000';

Cypress.Commands.add('deleteAllRecommendations', () => {
	cy.request('DELETE', `${API_URL}/test/delete-all`);
});

Cypress.Commands.add('createRecommendationByInterface', ({ name, link }) => {
	cy.visit(`${APP_URL}/`);
	cy.get('[data-test="input-name"]').type(name);
	cy.get('[data-test="input-url"]').type(link);

	cy.intercept('POST', '/recommendations').as('postRecommendation');
	cy.get('[data-test="button-create"]').click();
	cy.wait('@postRecommendation');
});

Cypress.Commands.add(
	'createRecommendationByApi',
	({ linksData, options: { includeScore = false, setScore = 0 } = {} }) => {
		for (let i = 0; i < linksData.length; i++) {
			const { name, link } = linksData[i];
			const scoreValue = setScore || i + 10;

			cy.request('POST', `${API_URL}/test/insert`, {
				name,
				youtubeLink: link,
				score: includeScore || setScore ? scoreValue : 0,
			});
		}
	}
);
