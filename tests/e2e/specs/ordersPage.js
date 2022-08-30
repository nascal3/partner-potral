
describe('The order feature works', () => {
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

    it('Have the first order in the page', () => {
        cy.get('table tbody tr td').eq(0).as("orderNumber")
        cy.get("@orderNumber").should("contain", 'AJ74G4773-NJM')
    })

    it('The order has more order details available', () => {
        cy.get('table tbody tr td').eq(7).click()
        cy.wait('@ordersDetails').then((interception) => {
            expect(interception.response.statusCode).to.equal( 200)
            cy.get('.main-location-text').eq(0).as("destination")
            cy.get("@destination").should("contain", 'Kahawa Wendani')
        })
    })

})
