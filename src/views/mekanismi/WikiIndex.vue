<template>
  <ViewHeader>
    {{ $t('mekanismi.title') }}
  </ViewHeader>
  <div class="contentGrid">
    <SiteList />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ViewHeader from '@/components/app/ViewHeader.vue'
import SiteList from '@/components/sites/SiteList.vue'

export default defineComponent({
  name: 'WikiIndex',
  components: {
    ViewHeader,
    SiteList
  }
})
</script>
