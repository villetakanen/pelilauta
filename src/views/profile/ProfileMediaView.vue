<template>
  <div class="profileMediaView">
    <ProfileToolbar />
    <div class="singleColumnLayout">
      <ProfileAssetList />
    </div>
  </div>
</template>

<script lang="ts">
import ProfileAssetList from '@/components/profile/assets/ProfileAssetList.vue'
import ProfileToolbar from '@/components/profile/ProfileToolbar.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProfileMediaView',
  components: { ProfileAssetList, ProfileToolbar },
  setup () {
  }
})
</script>
