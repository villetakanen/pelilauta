<template>
  <div class="wikiIndex">
    <SiteListToolbar v-model:filterTag="filter" />
    <div class="emptyLayout">
      <SiteList :filter="filter" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import SiteList from '@/components/sites/SiteList.vue'
import SiteListToolbar from '@/components/sites/SiteListToolbar.vue'

export default defineComponent({
  name: 'WikiIndex',
  components: {
    SiteList,
    SiteListToolbar
  },
  setup () {
    const filter = ref('')
    function setFilter (val:string) {
      console.debug('setFilter')
      filter.value = val
    }
    return { filter, setFilter }
  }
})
</script>
