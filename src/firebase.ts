import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/analytics'
import { useAuthState } from '@/state/authz'

let init = false

function _init () {
  if (init) return
  init = true
  firebase.initializeApp({
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VUE_APP_FIREBASE_APP_ID,
    measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
  })
  firebase.auth().onAuthStateChanged((user) => {
    const { onAuthStateChanged } = useAuthState()
    onAuthStateChanged(user)
  })
  firebase.firestore().enablePersistence()
  firebase.analytics()
}

export function useFirebase (): void {
  _init()
}
