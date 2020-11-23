<template>
  <div>
    <MaterialAction>{{ $t('action.createSite') }}</MaterialAction>
    <div
      v-for="site in sites"
      :key="site.name"
    >
      {{ site.name }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'SiteList',
  setup () {
    const sites = ref([{ name: 'aa' }])
    return { sites }
  }
})
</script>
