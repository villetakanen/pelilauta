<template>
  <div class="wikiIndex">
    <SiteListToolbar v-model:filterTag="filter" />
    <div class="bookLayout">
      <SiteList :filter="filter" />
      <Column>
        <CreateASiteAd />
      </Column>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import SiteList from '@/components/sites/SiteList.vue'
import SiteListToolbar from '@/components/sites/SiteListToolbar.vue'
import CreateASiteAd from '@/components/home/cta/CreateASiteAd.vue'
import Column from '@/components/layout/Column.vue'

export default defineComponent({
  name: 'WikiIndex',
  components: {
    SiteList,
    SiteListToolbar,
    CreateASiteAd,
    Column
  },
  setup () {
    const filter = ref('')
    return { filter }
  }
})
</script>
