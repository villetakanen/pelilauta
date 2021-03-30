import { useAuthState } from './state'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'
import 'firebase/storage'
import { Asset } from '@/utils/firestoreInterfaces'
import { computed, ComputedRef, ref } from 'vue'

const siteAssets = ref(new Map<string, Asset>())
const assets = computed(() => siteAssets.value)

async function uploadAsset (file:File): Promise<string> {
  const { uid } = useAuthState()
  const storageRef = firebase.storage().ref()
  const fileRef = storageRef.child('authors/' + uid.value + '/' + file.name)
  const snapshot = fileRef.put(file)

  const storageAsset = (await snapshot).ref
  const url = await storageAsset.getDownloadURL()

  siteAssets.value.set(storageAsset.name, {
    name: storageAsset.name,
    url: url,
    creator: uid.value,
    lastUpdate: null,
    fullPath: storageAsset.fullPath
  })

  return url
}

export async function deleteAsset (name: string): Promise<void> {
  const { uid } = useAuthState()
  const storageRef = firebase.storage().ref()
  const fileRef = storageRef.child('authors/' + uid.value + '/' + name)
  await fileRef.delete()
  siteAssets.value.delete(name)
}

async function patchAsset (storageAsset: firebase.storage.Reference, uid:string): Promise<void> {
  const url = await storageAsset.getDownloadURL()
  console.debug('patching:', url)
  siteAssets.value.set(storageAsset.name, {
    name: storageAsset.name,
    url: url,
    creator: uid,
    lastUpdate: null,
    fullPath: storageAsset.fullPath
  })
}

export async function fetchAssets (uid: string): Promise<void> {
  const storage = firebase.storage()
  const bucket = storage.ref().child('authors').child(uid)
  const storageAssetList = await bucket.listAll()

  siteAssets.value = new Map<string, Asset>()
  storageAssetList.items.forEach(async (storageAsset) => patchAsset(storageAsset, uid))
}

export function useAssets (): {
    uploadAsset: (file:File) => Promise<string>
    assets: ComputedRef<Map<string, Asset>>
    } {
  return { uploadAsset, assets }
}
