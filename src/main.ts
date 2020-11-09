import { createApp } from 'vue'
import { createI18n, LocaleMessageDictionary, VueMessageType } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import { useFirebase } from './lib/firebase'

useFirebase()

const app = createApp(App)
app.use(router)

app.directive('ripple', {
  beforeMount (el, bind) {
    el.onmousedown = function (e: MouseEvent) {
      let offset = [0, 0] // x = 0, y = 1
      // If position is relative, we can use local co-ordinates
      // If it is fixed, we need to pull calculate them from window scroll and
      // el.getBoundingClientRect
      // for flex-box stuff, we need to do something else --> thus three options here
      if (typeof bind.value === 'string' && bind.value === 'fixed-y') {
        offset = [
          el.offsetLeft,
          el.getBoundingClientRect().y + window.scrollY
        ]
      } else if (typeof bind.value === 'string' && bind.value === 'fixed') {
        offset = [
          el.getBoundingClientRect().x + window.scrollX, // x
          el.getBoundingClientRect().y + window.scrollY // y
        ]
      } else {
        offset = [
          el.offsetLeft, // x
          el.offsetTop // y
        ]
      }
      const x = e.pageX - offset[0] // x
      const y = e.pageY - offset[1] // y
      const w = this.offsetWidth

      const ripple = document.createElement('span')

      ripple.className = 'materialRippleEffect'
      ripple.style.left = x + 'px'
      ripple.style.top = y + 'px'
      ripple.style.setProperty('--scale', w)

      el.appendChild(ripple)

      setTimeout(() => {
        if (ripple.parentNode) ripple.parentNode.removeChild(ripple)
      }, 800)
    }
  }
})

function loadLocaleMessages () {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages:Record<string, LocaleMessageDictionary<VueMessageType>> = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

function getNavigatorLocale () {
  const navigatorLocale =
    navigator.languages !== undefined
      ? navigator.languages[0]
      : navigator.language
  if (!navigatorLocale) return 'en'
  return navigatorLocale.trim().split(/-|_/)[0]
}

const i18n = createI18n({
  locale: getNavigatorLocale(),
  fallbackLocale: 'en',
  messages: loadLocaleMessages()
})

app.use(i18n)
app.mount('#app')
