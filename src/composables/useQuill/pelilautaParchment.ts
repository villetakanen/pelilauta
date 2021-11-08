import { logEvent } from '@/utils/eventLogger'
import { wikiLinkModule } from '@/utils/quill/wikiLinkModule'
import Quill from 'quill'
import { ImageModule } from './imageModule'
let _init = false

export function initPelilautaParchment (): void {
  if (_init) return
  _init = true

  Quill.register('modules/image', ImageModule)
  Quill.register('modules/wikilinks', wikiLinkModule)

  logEvent('Quill parchment loaded')
}
