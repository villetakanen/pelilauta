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

describe('PageFabs', () => {
  it('Has an add a thread -action', () => {
    cy.visit('/testing/login')
    cy.get('#usernameField').type(Cypress.env('TEST_USER_EMAIL'))
    cy.get('#passwordField').type(Cypress.env('TEST_USER_PASSWORD'))
    cy.get('#post').click()
    cy.wait(300)

    cy.visit('/mekanismi/view/e2e-testing/e2e-testing')
    cy.get('#pageFabsCreateThread').click()
    cy.url().should('include', '/add/thread')
  })
})
