import { useAuthState } from './state'
import { Asset } from '@/utils/firestoreInterfaces'
import { computed, ComputedRef, ref } from 'vue'
import { StorageReference, ref as storeRef, getStorage, uploadBytes, getDownloadURL, deleteObject, listAll } from '@firebase/storage'

const siteAssets = ref(new Map<string, Asset>())
const assets = computed(() => siteAssets.value)

async function uploadAsset (file:File): Promise<string> {
  const { uid } = useAuthState()
  const fileRef = storeRef(getStorage(), 'authors/' + uid.value + '/' + file.name)
  const snapshot = await uploadBytes(fileRef, file)

  const storageAsset = (await snapshot).ref
  const url = await getDownloadURL(fileRef)

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
  const fileRef = storeRef(getStorage(), 'authors/' + uid.value + '/' + name)
  await deleteObject(fileRef)
  siteAssets.value.delete(name)
}

async function patchAsset (storageAsset: StorageReference, uid:string): Promise<void> {
  const url = await getDownloadURL(storageAsset)
  // console.debug('patching:', url)
  siteAssets.value.set(storageAsset.name, {
    name: storageAsset.name,
    url: url,
    creator: uid,
    lastUpdate: null,
    fullPath: storageAsset.fullPath
  })
}

export async function fetchAssets (uid: string): Promise<void> {
  const bucket = storeRef(getStorage(), 'authors/' + uid)
  const storageAssetList = await listAll(bucket)

  siteAssets.value = new Map<string, Asset>()
  storageAssetList.items.forEach(async (storageAsset) => patchAsset(storageAsset, uid))
}

export function useAssets (): {
    uploadAsset: (file:File) => Promise<string>
    assets: ComputedRef<Map<string, Asset>>
    } {
  return { uploadAsset, assets }
}
