// ***********************************************
// This example authStubs.js shows you how to
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
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import "cypress-localstorage-commands"
import partnerToken from "../fixtures/partnerToken.json";
import convoy from "../fixtures/convoy.json";
import stats from "../fixtures/stats.json";
const APIbaseUrl = 'https://partner-bff-test.sendyit.com/api/v1'
const fro = '2022-02-11 00:00:00'
const to = '2022-02-18 23:59:50'

Cypress.Commands.add('authStubs', () => {
    cy.intercept('POST', `${APIbaseUrl}/otp/generate`, {
        statusCode: 201,
        body: {
            email: "caleb@sendyit.com",
            product_group: "convoy"
        }
    }).as('user')

    cy.intercept('POST', `${APIbaseUrl}/sign-in`, {
        statusCode: 200,
        body: {
            code: "1234",
            email: "test@mail.com",
            product_group: "convoy"
        }
    }).as('sign_in')

    cy.intercept('GET', `${APIbaseUrl}/dashboard/stats?from=${fro}&to=${to}`, {
        statusCode: 200,
        body: stats
    }).as('stats')
})

Cypress.Commands.add("setTokens", () => {
    cy.setLocalStorage('sendy:partner', JSON.stringify(partnerToken))
    cy.setLocalStorage('sendy:convoy', convoy.token)
    cy.setLocalStorage('setLanguage', 'en')
})

Cypress.Commands.add("removeTokens", () => {
    cy.clearLocalStorageSnapshot()
})
