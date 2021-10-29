import { getAuth } from '@firebase/auth'
import { initializeApp } from '@firebase/app'
import { initializeFirestore, CACHE_SIZE_UNLIMITED, enableIndexedDbPersistence } from '@firebase/firestore'
let init = false

export function createFirebase (): void {
  if (init) return
  init = true
  const app = initializeApp({
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VUE_APP_FIREBASE_APP_ID,
    measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
  })
  getAuth(app)
  const db = initializeFirestore(app, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  })
  try {
    enableIndexedDbPersistence(db)
    /*
    console.log('got db', db)

    getDocFromServer(doc(db, 'meta', 'pelilauta')).then((result) => {
      console.log('got result from server', result)
    }) */
  } catch (error:unknown) {
    console.warn(error)
  }
}
