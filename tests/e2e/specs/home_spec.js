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

describe('Home page functionality', () => {
  it('Loads the welcome card', () => {
    cy.visit('/', {
      onBeforeLoad: function (win) {
        const promise = new Promise(function (resolve) {})
        // eslint-disable-next-line no-return-assign
        return win.navigator.serviceWorker.register = function () {
          return promise
        }
      }
    })
    cy.contains('h1', 'Welcome to Pelilauta')
  })
  it('Loads the Mekanismi card', () => {
    cy.visit('/')
    cy.contains('h1', 'Mekanismi')
  })
})
