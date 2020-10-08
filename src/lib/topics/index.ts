import { computed, ref } from 'vue'
import * as firebase from 'firebase/app'
import 'firebase/firestore'

const storage = window.localStorage

export interface Topic {
  slug: string;
  title: string;
  description?: string;
  icon?: string;
}

// topics, typed, and read only
const topicsTyped: Topic[] = []
const topicsRef = ref(topicsTyped)
const topics = computed((): Topic[] => (topicsRef.value))

function updateTopicsFromFirebase (newTopicList: Topic[]) {
  topicsRef.value = newTopicList
  storage.setItem('pelilauta.meta.stream.topics', JSON.stringify(newTopicList))
}

// Init!
// let unsubscribe = () => {}
let init = false
function _init () {
  if (init) return
  init = true

  // get topics from offline store
  const stored = storage.getItem('pelilauta.meta.stream.topics')
  if (stored) topicsRef.value = JSON.parse(stored) as Topic[]

  // fetch online versions
  const db = firebase.firestore()
  const metaRef = db.collection('meta').doc('pelilauta')
  metaRef.onSnapshot((doc) => {
    updateTopicsFromFirebase(doc.data()?.topics as Topic[])
  })
}

/* export function useTopics () {
  _init()
  return { topics }
} */
