describe('Authentication features works', () => {
  after(() => {
    cy.removeTokens()
  })

  it('Get to the OTP page and login', () => {
    cy.visit('/')
    cy.authStubs()
    cy.ordersStubs()

    cy.contains('Enter your email address *')
    cy.get('input[type=text]').type('caleb@sendyit.com')
    cy.get('.v-btn').click({ multiple: true, force: true })
    cy.wait('@user').its('response.statusCode').should('equal', 201)
    cy.url().should('include', '/auth/verify')

    cy.get('.v-otp-input .v-input').eq(0).type('1')
    cy.get('.v-otp-input .v-input').eq(1).type('2')
    cy.get('.v-otp-input .v-input').eq(2).type('3')
    cy.get('.v-otp-input .v-input').eq(3).type('4')
    cy.wait('@sign_in').then((resp) => {
      cy.setTokens()
    })
    // cy.wait('@abilities')


    cy.visit('/orders')
    cy.get('.v-list a').eq(0).click()
    cy.wait('@orders')

    cy.get('.title').as("title")
    cy.get("@title").should("contain", 'Orders')
  })

})
