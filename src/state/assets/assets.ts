import { logDebug, logError, logEvent } from '@/utils/eventLogger'
import { FirebaseError } from '@firebase/app'
import { Timestamp, DocumentData, serverTimestamp, FieldValue, onSnapshot, query, collection, getFirestore, where, addDoc, getDoc, doc, deleteDoc } from '@firebase/firestore'
import { getStorage, ref as storageRef, uploadString, getDownloadURL, deleteObject } from '@firebase/storage'
import { computed, ComputedRef, reactive, ref } from 'vue'
import { useAuth } from '../authz'

export const LICENSE_NONE = 1
export const LICENSE_CC_BY = 2
export const LICENSE_PUBLIC_DOMAIN = 3

export class Asset {
  id: string
  created: Timestamp | null
  modified: Timestamp | null
  url: URL | undefined
  description: string
  owner: string
  license: number
  site: string | undefined
  name: string
  mimetype: string

  constructor (id?:string, data?:DocumentData) {
    this.id = id || ''
    this.name = data?.name || ''
    this.created = data?.createdAt || null
    this.modified = data?.modifiedAt || data?.createdAt || null
    this.url = data?.url ? new URL(data.url) : undefined
    this.description = data?.description || ''
    this.owner = data?.owner || ''
    this.license = data?.license || LICENSE_NONE
    this.site = data?.site
    this.mimetype = data?.type || 'application/octet-stream'
  }

  dry (): {
    createdAt: Timestamp | FieldValue
    modifiedAt: Timestamp | FieldValue
    url: string
    description: string
    owner: string
    license: number
    site: string | undefined
    name: string,
    type: string
    } {
    return {
      createdAt: this.created || serverTimestamp(),
      modifiedAt: this.created || serverTimestamp(),
      url: this.url?.href || '',
      description: this.description,
      owner: this.owner,
      license: this.license,
      site: this.site,
      name: this.name,
      type: this.mimetype
    }
  }
}

const state = reactive({
  uid: ''
})
const userAssets = ref(new Map<string, Asset>())
const assets = computed(() => (userAssets.value))

let unsubscribe:CallableFunction|undefined

function subscribeToAssets () {
  if (unsubscribe) unsubscribe()
  logEvent('Firestore subs', { collecton: 'Assets' })
  unsubscribe = onSnapshot(
    query(
      collection(
        getFirestore(),
        'assets'
      ),
      where('owner', '==', state.uid)
    ),
    (assetChanges) => {
      assetChanges.docChanges().forEach((assetChange) => {
        if (assetChange.type === 'removed') {
          userAssets.value.delete(assetChange.doc.id)
        } else {
          userAssets.value.set(
            assetChange.doc.id,
            new Asset(
              assetChange.doc.id,
              assetChange.doc.data()
            )
          )
        }
      })
    }
  )
}

async function uploadAsset (name: string, mimetype:string, dataURL:string): Promise<Asset> {
  const { user } = useAuth()
  const storage = getStorage()

  const asseteRef = storageRef(
    storage,
    '/assetuploads/' + user.value.uid + '/' + name
  )

  const storageSnapshot = await uploadString(
    asseteRef,
    dataURL,
    'data_url'
  )

  const downloadUrl = await getDownloadURL(asseteRef)

  const assetDocRef = await addDoc(
    collection(getFirestore(), 'assets'),
    {
      name: name,
      owner: user.value.uid,
      storagePath: storageSnapshot.metadata.fullPath,
      url: downloadUrl,
      created: serverTimestamp(),
      type: mimetype
    }
  )

  const assetDoc = await getDoc(assetDocRef)
  const asset = new Asset(assetDoc.id, assetDoc.data())

  return asset
}

async function deleteAsset (id:string): Promise<void> {
  const { user } = useAuth()
  const assetDocRef = doc(getFirestore(), 'assets', id)
  const assetDoc = await getDoc(assetDocRef)

  if (assetDoc.data()?.owner !== user.value.uid) throw new Error('Delete would fail due to the firebase side security rules, aborting.')

  const storage = getStorage()
  try {
    const asseteRef = storageRef(
      storage,
      assetDoc.data()?.storagePath
    )
    await deleteObject(asseteRef)
  } catch (err) {
    if ((err as FirebaseError).code !== 'storage/object-not-found') throw err
    logError('Asset does not exist, deleting the Firestore record')
  }

  return deleteDoc(assetDocRef)
}

export function useAssets (): {
    assets: ComputedRef<Map<string, Asset>>
    uploadAsset: (name: string, mimetype: string, dataURL:string) => Promise<Asset>
    deleteAsset: (id:string) => Promise<void>
    } {
  const { user } = useAuth()
  if (user.value.uid !== state.uid) {
    state.uid = user.value.uid
    subscribeToAssets()
  }
  return { assets, uploadAsset, deleteAsset }
}
