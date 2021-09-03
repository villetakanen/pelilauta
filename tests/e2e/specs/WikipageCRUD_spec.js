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
describe('Wikipage', () => {
  it('Can create and destroy a page', () => {
    cy.visit('/testing/login')
    cy.get('#usernameField').type(Cypress.env('TEST_USER_EMAIL'))
    cy.get('#passwordField').type(Cypress.env('TEST_USER_PASSWORD'))
    cy.get('#post').click()

    cy.wait(300)

    // Go to the hidden e2e testing site
    cy.visit('/mekanismi/view/e2e-testing/e2e-testing')
    cy.get('#wikipageCreatePageFab').click()
    cy.get('#addPageCardPageNameField').type('A bit complicated te5t page & named silly for €€€')
    cy.get('#addPageCardCreateButton').click()

    cy.wait(300)

    // Did we succeed
    cy.visit('/site/e2e-testing/page/a-bit-complicated-te5t-page-named-silly-for-/edit')

    // Delete the page we created
    cy.get('#pageEditorToggleEditorButton').click()
    cy.get('#pageEditorDeleteButton').click()
    cy.get('#pageEditorDeleteVerifyField').type('DELETE')
    cy.get('#pageEditorDeleteVerifyButton').click()
  })
})
