describe('Authentication features works', () => {
  after(() => {
    cy.removeTokens()
  })

  it('Get to the OTP page and login', () => {
    cy.visit('/')
    cy.authStubs()

    cy.contains('The journey is our home - in it we are forever lost in the right direction.')
    cy.get('input[type=text]').type('caleb@sendyit.com', {force: true})
    cy.get('button').click({force: true})
    cy.wait('@user').its('response.statusCode').should('equal', 201)
    cy.url().should('include', '/auth/verify')

    cy.get('.v-otp-input .v-input').eq(0).type('1')
    cy.get('.v-otp-input .v-input').eq(1).type('2')
    cy.get('.v-otp-input .v-input').eq(2).type('3')
    cy.get('.v-otp-input .v-input').eq(3).type('4')
    cy.wait('@sign_in').then((resp) => {
      cy.setTokens()
    })

    cy.visit('dashboard')
    // cy.wait('@stats')
    cy.get('.v-list a').eq(0).click()

    cy.get('.title').as("title")
    cy.get("@title").should("contain", 'Dashboard')
  })

})
