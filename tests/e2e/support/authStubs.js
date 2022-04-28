import "cypress-localstorage-commands"
import constants from "../fixtures/constants.json";
import partnerToken from "../fixtures/partnerToken.json";
// import stats from "../fixtures/stats.json";

Cypress.Commands.add('authStubs', () => {
    cy.intercept('POST', `${constants.APIbaseUrl}/otp/generate`, {
        statusCode: 201,
        body: {
            email: "caleb@sendyit.com",
            authenticator: "otp",
            identification_method: "email",
            product_group: "partner",
        }
    }).as('user')

    cy.intercept('POST', `${constants.APIbaseUrl}/sign-in`, {
        statusCode: 200,
        body: {
            code: "1234",
            email: "caleb@sendyit.com",
            product_group: "partner"
        }
    }).as('sign_in')

    // cy.intercept('GET', `${APIbaseUrl}/dashboard/stats?*`, {
    //     statusCode: 200,
    //     body: stats
    // }).as('stats')
})

Cypress.Commands.add("setTokens", () => {
    cy.setLocalStorage('sendy:partner', JSON.stringify(partnerToken))
    cy.setLocalStorage('setLanguage', 'en')
})

Cypress.Commands.add("removeTokens", () => {
    cy.clearLocalStorageSnapshot()
})
