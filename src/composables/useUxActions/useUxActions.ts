import { copyUrl } from '@/utils/window'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useSnack } from '../useSnack'

export function useUxActions (): { back: CallableFunction, reroute: CallableFunction, copyLinkToClipboard: CallableFunction } {
  const router = useRouter()
  const i18n = useI18n()
  const { pushSnack } = useSnack()

  function back () {
    // console.debug('useUxActions', 'back()')
    router.back()
  }

  function reroute (route:string) {
    router.push(route)
  }

  function copyLinkToClipboard () {
    copyUrl()
    pushSnack({ topic: i18n.t('global.messages.linkShared') })
  }

  return { back, reroute, copyLinkToClipboard }
}
