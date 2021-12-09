<template>
  <Column class="SiteThemeTool">
    <h1 class="title">
      {{ $t('site.themetool.title') }}
    </h1>
    <AvatarSelector
      v-model="avatar"
      :default-avatar="site.system + '-logo'"
    />
    <div
      v-if="showAdminTools"
      class="debug"
    >
      {{ site.theme }}
    </div>
  </Column>
</template>

<script lang="ts">
import AvatarSelector from '@/components/avatar/AvatarSelector.vue'
import Column from '@/components/layout/Column.vue'
import { useAuth } from '@/state/authz'
import { useSite } from '@/state/site'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  components: { Column, AvatarSelector },
  setup () {
    const { site, updateSite } = useSite()
    const { showAdminTools } = useAuth()

    const avatar = computed({
      get: () => site.value.theme.avatarImageURL,
      set: (value:string) => {
        updateSite({ avatarImageURL: value })
      }
    })

    return {
      site,
      showAdminTools,
      avatar
    }
  }
})
</script>
