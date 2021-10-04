import { useI18n } from 'vue-i18n'
import { useSnack } from './useSnack'
import { copyUrl } from '@/utils/window'

export function useCopyLinkToClipboard (): CallableFunction {
  const i18n = useI18n()
  const { pushSnack } = useSnack()
  return () => {
    copyUrl()
    pushSnack({ topic: i18n.t('global.messages.linkShared') })
  }
}
