import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import { DateTime } from 'luxon'

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

export const toDisplayString = (timestamp: firebase.firestore.Timestamp|string|null): string => {
  if (timestamp === null) return '---'
  const date = (typeof timestamp === 'string') ? DateTime.fromISO(timestamp) : DateTime.fromSeconds(timestamp.seconds)
  const duration = DateTime.now().diff(date)
  if (duration.toMillis() < 30 * 60000) {
    // less than 30 minutes ago
    return '< 30 min'
  }
  if (duration.toMillis() < 4 * 60 * 60000) {
    // less than 4 hours ago
    return '< 4h'
  }
  return date.toFormat('dd.MM.yyyy – HH:mm')
}

export const toUTCDate = (timestamp: firebase.firestore.Timestamp|null): Date => {
  return new Date(getSeconds(timestamp) * 1000)
}

export const getSeconds = function (time?: firebase.firestore.Timestamp|null): number {
  if (!time) return 0
  return time.seconds
}
