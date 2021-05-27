before(function () {
  // run this once before all code
  return window.caches.keys().then(function (cacheNames) {
    return Promise.all(
      cacheNames.map(function (cacheName) {
        return window.caches.delete(cacheName)
      })
    )
  })
})

// Note: we are testing for a regression bug of _pelilauta.web.app_ here.
// for future reference, this test might target separate e2e testing firebase project
// with injected data for the test
describe('Profile Inbox functionality', () => {
  it('Sees the inbox view after logging in', () => {
    cy.visit('/testing/login')
    cy.get('#usernameField').type(Cypress.env('TEST_USER_EMAIL'))
    cy.get('#passwordField').type(Cypress.env('TEST_USER_PASSWORD'))
    cy.get('#post').click()

    cy.wait(300)

    cy.contains('h3', 'Test Subject 37')
    cy.get('#inboxAction').click()
    cy.contains('h1', 'Nostot')
  })
})
