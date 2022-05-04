import orders from "../fixtures/orders.json";
import drivers from "../fixtures/drivers.json";
import constants from "../fixtures/constants.json";

Cypress.Commands.add('ordersStubs', () => {

    cy.intercept('GET', `${constants.APIbaseUrl}//partners/141/users?roles=driver`, {
        statusCode: 200,
        body: drivers
    }).as('drivers')

    cy.intercept('GET', `${constants.APIbaseUrl}/partners/141/orders?*`, {
        statusCode: 200,
        body: orders
    }).as('orders')
})
