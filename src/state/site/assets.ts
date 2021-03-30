import { computed, ComputedRef, ref } from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'
import 'firebase/storage'
import { Asset } from '../../utils/firestoreInterfaces'

/*
 * This module handles site's assets and asset management.
 *
 * Due to legacy reasons, we also do include some migration logic at this
 * state component. The migration and error correction code might want to
 * live in pelilauta-functions in the future.
 */

let siteid = ''

const siteAssets = ref(new Map<string, Asset>())
const assets = computed(() => siteAssets.value)

async function patchAsset (storageAsset: firebase.storage.Reference): Promise<void> {
  const database = firebase.firestore()
  const firestoreAssetsRef = database.collection('sites').doc(siteid).collection('assetMeta')

  const url = await storageAsset.getDownloadURL()
  const databaseAssetRef = firestoreAssetsRef.doc(storageAsset.name)
  let databaseAssetDoc = await databaseAssetRef.get()

  // migration code for db sanity, might want to live in pelilauta-functions, or be deprecated at some point
  try {
    if (!(await databaseAssetDoc).exists) {
      console.debug('migtrating asset', siteid, storageAsset.name)
      await databaseAssetRef.set({
        lastUpdate: firebase.firestore.FieldValue.serverTimestamp(),
        creator: 'migrated by the app'
      })
      databaseAssetDoc = await databaseAssetRef.get()
    }
  } catch (error) {
    console.error('insufficcient priviledges to update db', error)
  }

  siteAssets.value.set(storageAsset.name, {
    name: storageAsset.name,
    url: url,
    creator: databaseAssetDoc.data()?.creator || '',
    lastUpdate: databaseAssetDoc.data()?.lastUpdate || null,
    fullPath: storageAsset.fullPath
  })
}

export async function uploadAsset (file:File, uid: string): Promise<void> {
  const storageRef = firebase.storage().ref()
  const fileRef = storageRef.child(siteid + '/' + file.name)
  const snapshot = fileRef.put(file)

  const storageAsset = (await snapshot).ref

  const database = firebase.firestore()
  const firestoreAssetRef = database.collection('sites').doc(siteid).collection('assetMeta').doc(file.name)

  await firestoreAssetRef.set({
    creator: uid,
    lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
  })

  return patchAsset(storageAsset)
}

export async function deleteAsset (name: string): Promise<void> {
  const storageRef = firebase.storage().ref()
  const fileRef = storageRef.child(siteid + '/' + name)
  await fileRef.delete()

  const database = firebase.firestore()
  const firestoreAssetRef = database.collection('sites').doc(siteid).collection('assetMeta').doc(name)

  await firestoreAssetRef.delete()

  siteAssets.value.delete(name)
}

export async function subscribeTo (id: string): Promise<void> {
  if (siteid === id) return
  siteid = id

  const storage = firebase.storage()
  const storageAssetList = await storage.ref().child(siteid).listAll()

  siteAssets.value = new Map<string, Asset>()
  storageAssetList.items.forEach(async (storageAsset) => patchAsset(storageAsset))
}

export function useAssets (): { assets: ComputedRef<Map<string, Asset>> } {
  return { assets }
}
