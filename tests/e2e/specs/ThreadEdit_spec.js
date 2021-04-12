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
describe('Thread editor functionality', () => {
  it('Does show the login screen to unlogged user', () => {
    cy.visit('/stream/add/thread')
    cy.contains('p', 'Google Firebase Authentication')
  })
  it('Sees v3 edit view after logging in', () => {
    cy.visit('/testing/login')
    cy.get('#usernameField').type(Cypress.env('TEST_USER_EMAIL'))
    cy.get('#passwordField').type(Cypress.env('TEST_USER_PASSWORD'))
    cy.get('#post').click()

    cy.wait(300)

    cy.contains('h3', 'Test Subject 37')
    cy.get('#sideNavAction-home').click()
    cy.get('#addThreadFab').click()
    cy.contains('label', 'Thread title')
    cy.get('#threadEditorCancelButton').click()
    cy.contains('h1', 'Mekanismi')
  })
})
