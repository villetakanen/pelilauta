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
})
