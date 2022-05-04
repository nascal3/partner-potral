import "cypress-localstorage-commands"
import constants from "../fixtures/constants.json";
import partnerToken from "../fixtures/partnerToken.json";
import signIn from "../fixtures/signIn.json";
import languages from "../fixtures/languages.json";
import countries from "../fixtures/countries.json";

Cypress.Commands.add('authStubs', () => {
    cy.intercept('GET', `${constants.APIbaseUrl}/languages`, {
        statusCode: 200,
        body: languages
    }).as('languages')

    cy.intercept('GET', `${constants.APIbaseUrl}/countries`, {
        statusCode: 200,
        body: countries
    }).as('countries')

    cy.intercept('POST', `${constants.APIbaseUrl}/otp/generate`, {
        statusCode: 200,
        body: {
            "message": "Code generated successfully",
            "data": {
                "otp_expiry_time": 210
            }
        }
    }).as('generate')

    cy.intercept('POST', `${constants.APIbaseUrl}/sign-in`, {
        statusCode: 200,
        body: signIn
    }).as('sign-in')
})

Cypress.Commands.add("setTokens", () => {
    cy.setLocalStorage('sendy:partner', JSON.stringify(partnerToken))
    cy.setLocalStorage('setLanguage', 'en')
})

Cypress.Commands.add("removeTokens", () => {
    cy.clearLocalStorageSnapshot()
})
