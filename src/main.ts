import { createApp } from 'vue'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import App from './App.vue'
import router from './router'
import { useAuthz } from './lib/authz'

firebase.initializeApp({
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID
})
firebase.auth().onAuthStateChanged((user) => {
  const { onAuthStateChanged } = useAuthz()
  onAuthStateChanged(user)
})

createApp(App).use(router).mount('#app')
