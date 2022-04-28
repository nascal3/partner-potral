import orders from "../fixtures/orders.json";
import constants from "../fixtures/constants.json";

Cypress.Commands.add('ordersStubs', () => {
    cy.intercept('GET', `${constants.APIbaseUrl}/partners/9/orders?*`, {
        statusCode: 200,
        body: orders
    }).as('orders')
})
