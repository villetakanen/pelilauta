import firebase from 'firebase/app'
import 'firebase/firestore'

/**
 * Firestore URL fetching with cache
 */
export const fireStoreURL = function (path: string): Promise<string> {
  return new Promise<string>(function (resolve, reject) {
    const url = localStorage.getItem(path)
    if (url !== null) {
      resolve(url)
    }
    const storage = firebase.storage()
    const pathRef = storage.ref(path)
    pathRef.getDownloadURL().then((newUrl) => {
      localStorage.setItem(path, newUrl)
      if (!url) {
        resolve(newUrl)
      }
    }).catch((error) => {
      localStorage.removeItem(path)
      reject(error)
    })
  })
}

export const getSeconds = function (time: firebase.firestore.Timestamp|null): number {
  if (!time) return 0
  return time.seconds
}
