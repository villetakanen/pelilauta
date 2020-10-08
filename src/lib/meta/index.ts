import { ref, computed } from 'vue'
import * as firebase from 'firebase/app'
import 'firebase/firestore'

export interface Topic {
  slug: string;
  title: string;
  description?: string;
  icon?: string;
}

interface MetaState {
  admins: string[];
  topics: Topic[];
}

const state = ref({
  admins: [],
  topics: []
} as MetaState)

const isAdmin = (uid: string) => {
  // console.log(state.value.admins, state.value.admins.includes(uid), uid)
  return state.value.admins.includes(uid)
}
const topics = computed((): Topic[] => (state.value.topics))
/* const isMod = (uid: string, topic: string) => {
  for (const modArray in state.value.mods) {
    for (const mods in ((modArray as unknown) as Mod[])) {
      if (((mods as unknown) as Mod).topic === topic && ((mods as unknown) as Mod).mods.includes(uid)) return true
    }
  }
  return false
}
const getUserMods = (uid: string): string[] => {
  const userMods: string[] = []

  state.value.mods.forEach((modArray) => {
    modArray.mods.forEach((topic) => {
      if (((topic as unknown) as Mod).mods.includes(uid)) userMods.push(((topic as unknown) as Mod).topic)
    })
  })

  return userMods
} */

let init = false
function _init () {
  if (init) return
  init = true

  // fetch online versions
  const db = firebase.firestore()
  const metaRef = db.collection('meta').doc('pelilauta')
  metaRef.onSnapshot((doc) => {
    if (doc.exists) {
      state.value.admins = doc.data()?.admins
      state.value.topics = doc.data()?.topics
    }
  })
}

export function useMeta () {
  _init()
  return { isAdmin, topics }
}
