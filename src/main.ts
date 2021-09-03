import { createApp } from 'vue'
import { createI18n, LocaleMessageDictionary, VueMessageType } from 'vue-i18n'
import App from '@/App.vue'
import router from '@/router'
import { getNavigatorLocale } from '@/utils/window'
import { createFirebase } from '@/firebase'
import { createAuth } from '@/state/authz'

const app = createApp(App)
app.use(router)
createFirebase()
createAuth()

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

const i18n = createI18n({
  locale: getNavigatorLocale(),
  fallbackLocale: 'fi',
  messages: loadLocaleMessages()
})

app.use(i18n)
app.mount('#app')
