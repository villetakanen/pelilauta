<template>
  <div class="viewFull">
    <SiteListToolbar />
    <SiteList />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SiteList from '@/components/sites/SiteList.vue'
import SiteListToolbar from '@/components/sites/SiteListToolbar.vue'

export default defineComponent({
  name: 'WikiIndex',
  components: {
    SiteList,
    SiteListToolbar
  }
})
</script>

<style lang="sass" scoped>
.viewFull
  padding: 0 16px
</style>
