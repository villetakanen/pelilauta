<template>
  <Column class="SiteThemeTool">
    <h1 class="title">
      {{ $t('site.themetool.title') }}
    </h1>
    <div
      v-if="showAdminTools"
      class="debug"
    >
      {{ site.theme }}
    </div>
  </Column>
</template>

<script lang="ts">
import Column from '@/components/layout/Column.vue'
import { useAuth } from '@/state/authz'
import { useSite } from '@/state/site'
import { defineComponent } from 'vue'

export default defineComponent({
  components: { Column },
  setup () {
    const { site } = useSite()
    const { showAdminTools } = useAuth()
    return {
      site,
      showAdminTools
    }
  }
})
</script>
