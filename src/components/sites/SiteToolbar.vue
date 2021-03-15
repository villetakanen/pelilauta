<template>
  <Toolbar>
    <h3 class="clipWithEllipsis">
      <router-link :to="`/mekanismi/view/${site.id}/${site.id}`">
        {{ site.name }}
      </router-link>
    </h3>
    <div class="spacer" />
    <Action
      prepend="share"
      @click="copyLink"
    >
      <span class="hideOnMobile">{{ $t('action.share') }}</span>
    </Action>
    <Action
      prepend="attachments"
      :to="`/mekanismi/attachments/${site.id}/`"
    >
      <span class="hideOnMobile">{{ $t('mekanismi.attachments.title') }}</span>
    </Action>
    <Action
      prepend="players"
      :to="`/site/players/${site.id}/`"
    >
      <span class="hideOnMobile">{{ $t('site.players.title') }}</span>
    </Action>
    <Action
      prepend="equalizer"
      :to="`/site/meta/${site.id}`"
    >
      <span class="hideOnMobile">{{ $t('mekanismi.siteinfo') }}</span>
    </Action>
  </Toolbar>
</template>

<script lang="ts">
import { useSite } from '@/state/site'
import { defineComponent } from 'vue'
import { copyUrl } from '@/utils/window'
import Toolbar from '../layout/Toolbar.vue'
import Action from '../material/Action.vue'
import { useSnack } from '@/composables/useSnack'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  components: { Toolbar, Action },
  setup () {
    const { site } = useSite()
    const i18n = useI18n()
    const { pushSnack } = useSnack()
    const copyLink = () => {
      copyUrl()
      pushSnack({ topic: i18n.t('global.messages.linkShared') })
    }
    return { site, copyLink }
  }
})
</script>
