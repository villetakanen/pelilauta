<template>
  <div class="siteAssetsView">
    <div style="margin: 0 8px">
      <SiteToolbar />
    </div>
    <div class="mekanismiGrid">
      <div class="mainCard">
        <ImageUploadPane :siteid="siteid" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ImageUploadPane from '@/components/assets/ImageUploadPane.vue'
import SiteToolbar from '@/components/sites/SiteToolbar.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AddAssetView',
  components: { ImageUploadPane, SiteToolbar },
  props: {
    siteid: {
      type: String,
      required: true
    }
  }
})
</script>
