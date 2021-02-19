<template>
  <Toolbar>
    <h3>
      <router-link :to="`/mekanismi/view/${site.id}/${site.id}`">
        {{ site.name }}
      </router-link>
    </h3>
    <div class="spacer" />
    <Action
      prepend="attachments"
      :to="`/mekanismi/attachments/${site.id}/`"
    >
      <span class="hideOnMobile">{{ $t('mekanismi.attachments.title') }}</span>
    </Action>
    <Action
      prepend="site-settings"
      :to="`/mekanismi/siteinfo/${site.id}`"
    >
      <span class="hideOnMobile">{{ $t('mekanismi.siteinfo') }}</span>
    </Action>
  </Toolbar>
</template>

<script lang="ts">
import { useSite } from '@/state/site'
import { defineComponent } from 'vue'
import Toolbar from '../layout/Toolbar.vue'
import Action from '../material/Action.vue'

export default defineComponent({
  components: { Toolbar, Action },
  setup () {
    const { site } = useSite()
    return { site }
  }
})
</script>
