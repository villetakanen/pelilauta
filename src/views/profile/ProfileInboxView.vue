<template>
  <div class="profileMediaView">
    <ProfileToolbar />
    <div class="singleColumnLayout">
      <InboxMessages />
    </div>
  </div>
</template>

<script lang="ts">
import InboxMessages from '@/components/inbox/InboxMessages.vue'
import ProfileToolbar from '@/components/profile/ProfileToolbar.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProfileInboxView',
  components: { ProfileToolbar, InboxMessages }
})
</script>
