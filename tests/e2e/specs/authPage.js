
describe('Authentication features works', () => {
  after(() => {
    cy.removeTokens()
  })

  it('Get to the OTP page and login', () => {
    cy.visit('/')
    cy.authStubs()

    cy.intercept('/').as('loaded');
    cy.visit('/')
    cy.wait('@loaded').then(() => {
      cy.wait('@languages')
      cy.wait('@countries')
    })

    cy.get('.v-radio').eq(0).click()
    cy.contains('Enter your email address *')
    cy.get('input[type=text]').type('caleb@sendyit.com')
    cy.get('button .v-btn__content').contains('Get OTP Code').click()
    cy.wait('@generate').then((interception) => {
      expect(interception.response.statusCode).to.equal( 200)
    });
    cy.url().should('include', '/auth/verify')

    cy.get('.v-otp-input .v-input').eq(0).type('1')
    cy.get('.v-otp-input .v-input').eq(1).type('2')
    cy.get('.v-otp-input .v-input').eq(2).type('3')
    cy.get('.v-otp-input .v-input').eq(3).type('4')

    cy.wait('@sign-in').then((interception) => {
      expect(interception.response.statusCode).to.equal( 200)
      cy.url().should('include', '/orders')
      cy.get('.title').as("title")
      cy.get("@title").should("contain", 'Orders')
    })
  })

})
