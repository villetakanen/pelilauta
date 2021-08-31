import { computed, ComputedRef, ref } from 'vue'
import { Asset } from '../../utils/firestoreInterfaces'
import { getStorage, StorageReference, getDownloadURL, ref as storeRef, uploadBytes, deleteObject, listAll } from 'firebase/storage'
import { getFirestore, serverTimestamp, doc, getDoc, setDoc, deleteDoc } from '@firebase/firestore'

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

async function patchAsset (storageAsset: StorageReference): Promise<void> {
  const url = await getDownloadURL(storageAsset)

  const db = getFirestore()
  const databaseAssetRef = doc(db, 'sites', siteid, 'assetMeta', storageAsset.name)
  let databaseAssetDoc = await getDoc(databaseAssetRef)

  // migration code for db sanity, might want to live in pelilauta-functions, or be deprecated at some point
  try {
    if (!(await databaseAssetDoc).exists) {
      console.debug('migtrating asset', siteid, storageAsset.name)
      await setDoc(databaseAssetRef, {
        lastUpdate: serverTimestamp(),
        creator: 'migrated by the app'
      })
      databaseAssetDoc = await getDoc(databaseAssetRef)
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
  const fileRef = storeRef(getStorage(), siteid + '/' + file.name)
  const snapshot = await uploadBytes(fileRef, file)
  const storageAsset = snapshot.ref
  const firestoreAsset = doc(getFirestore(), 'sites', siteid, 'assetMeta', file.name)

  await setDoc(
    firestoreAsset,
    {
      creator: uid,
      lastUpdate: serverTimestamp()
    }
  )

  return patchAsset(storageAsset)
}

export async function deleteAsset (name: string): Promise<void> {
  const fileRef = storeRef(getStorage(), siteid + '/' + name)
  await deleteObject(fileRef)

  const firestoreAsset = doc(getFirestore(), 'sites', siteid, 'assetMeta', name)

  await deleteDoc(firestoreAsset)

  siteAssets.value.delete(name)
}

export async function subscribeTo (id: string): Promise<void> {
  if (siteid === id) return
  siteid = id

  const storageAssetList = await listAll(storeRef(getStorage(), siteid))

  siteAssets.value = new Map<string, Asset>()
  storageAssetList.items.forEach(async (storageAsset) => patchAsset(storageAsset))
}

export function useAssets (): { assets: ComputedRef<Map<string, Asset>> } {
  return { assets }
}
