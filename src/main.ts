import { createApp } from 'vue'
import { createI18n, LocaleMessageDictionary, VueMessageType } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import { useFirebase } from './lib/firebase'

useFirebase()

const app = createApp(App)
app.use(router)

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
