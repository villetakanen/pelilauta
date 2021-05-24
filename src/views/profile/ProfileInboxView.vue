<template>
  <div class="profileMediaView">
    <ProfileToolbar />
    <div class="singleColumnLayout">
      <h1 class="title">
        {{ $t('profile.inbox.title') }}
      </h1>
      ...
    </div>
  </div>
</template>

<script lang="ts">
import ProfileToolbar from '@/components/profile/ProfileToolbar.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProfileInboxView',
  components: { ProfileToolbar }
})
</script>
