<template>
  <Column>
    <h1>{{ $t('site.settings.metaData.title') }}</h1>
    <p>{{ $t('site.settings.metaData.createdAt') }}: {{ toDisplayString(site.createdAt) }}</p>
    <p>{{ $t('site.settings.metaData.updatedAt') }}: {{ toDisplayString(site.updatedAt) }}</p>

    <div class="debug">
      {{ site }}
    </div>
  </Column>
</template>

<script lang="ts">
import Column from '@/components/layout/Column.vue'
import { useSite } from '@/state/site'
import { computed, defineComponent } from 'vue'
import { toDisplayString } from '@/utils/firebaseTools'

export default defineComponent({
  name: 'SiteMetaData',
  components: { Column },
  setup () {
    const { site } = useSite()
    const updatedAt = computed(() => toDisplayString(site.value.updatedAt))
    return { site, toDisplayString, updatedAt }
  }
})
</script>
