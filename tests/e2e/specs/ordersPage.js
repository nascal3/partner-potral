
describe('The order feature works as expected', () => {
    before(() => {
        cy.setTokens()
    })

    beforeEach(() => {
        cy.ordersStubs()
    })

    after(() => {
        cy.removeTokens()
    })

    it('Get to the order page and view orders', () => {
        cy.intercept('/').as('loaded');
        cy.visit('/')
        cy.wait('@loaded').then(() => {
            cy.wait('@drivers').then(() => {
                cy.wait('@orders')
            })
        })

        cy.get('.title').as("title")
        cy.get("@title").should("contain", 'Orders')
    })

})
