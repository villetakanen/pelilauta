before(function () {
  // run this once before all code
  cy.task('seed:fsdb')
  // remove webworker stuff
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
describe('PlayersView works', () => {
  it('Shows the site toolbar', () => {
    cy.visit('/site/players/e2e-testing')
    cy.contains('h3', 'e2e-testing')
  })
})
