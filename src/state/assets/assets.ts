import { Timestamp, DocumentData, serverTimestamp, FieldValue, onSnapshot, query, collection, getFirestore, where } from '@firebase/firestore'
import { computed, ComputedRef } from 'vue-demi'
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
  }

  dry (): {
    createdAt: Timestamp | FieldValue
    modifiedAt: Timestamp | FieldValue
    url: string
    description: string
    owner: string
    license: number
    site: string | undefined
    name: string
    } {
    return {
      createdAt: this.created || serverTimestamp(),
      modifiedAt: this.created || serverTimestamp(),
      url: this.url?.href || '',
      description: this.description,
      owner: this.owner,
      license: this.license,
      site: this.site,
      name: this.name
    }
  }
}

const state = {
  uid: '',
  userAssets: new Map<string, Asset>()
}

const assets = computed(() => (Array.from(state.userAssets.values())))

let unsubscribe:CallableFunction|undefined

function subscribeToAssets () {
  if (unsubscribe) unsubscribe()
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
          state.userAssets.delete(assetChange.doc.id)
        } else {
          state.userAssets.set(
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

async function uploadAsset (name: string, dataURL:string): Promise<Asset> {
  const a = new Asset()
  a.name = name
  return a
  /*
    How to do it – https://firebase.google.com/docs/storage/web/upload-files
    const storage = getStorage();
    const storageRef = ref(storage, 'some-child')
    const message4 = 'data:text/plain;base64,5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB';
      uploadString(storageRef, message4, 'data_url').then((snapshot) => {
      console.log('Uploaded a data_url string!');
    });
  */
}

export function useAssets (): { assets: ComputedRef, uploadAsset: (name: string, dataURL:string) => Promise<Asset> } {
  const { user } = useAuth()
  if (user.value.uid !== state.uid) {
    state.uid = user.value.uid
    subscribeToAssets()
  }
  return { assets, uploadAsset }
}
