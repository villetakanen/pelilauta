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
describe('Thread card functionality', () => {
  it('Shows author name', () => {
    cy.visit('/thread/2Qvy6kEmO3klsS4xukK1/view')
    cy.contains('a', 'Jukka Sorsa')
  })
})
