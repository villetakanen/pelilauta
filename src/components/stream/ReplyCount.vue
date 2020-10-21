<template>
  <div class="replyCount">
    <div v-if="newReplies" class="notificationPill">
      <img src="@/assets/icons/pulse.svg">
      {{ $t('post.newRepliesNote') }}
    </div>
    <router-link :to="`/stream/view/${threadid}`">
      {{ thread.replyCount }} {{ $t('post.nOfReplies') }}
    </router-link>
    <br>
    {{ thread.flowTime }}
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useThread } from '@/state/threads'

export default defineComponent({
  props: {
    threadid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const thread = useThread(props.threadid)
    // const replyCount = computed(() => (1))
    const newReplies = computed(() => (true))
    return { newReplies, thread }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass
@import @/styles/material-colors.sass

.notificationPill
  height: 20px
  margin: 4px
  padding: 0px 8px
  background-color: $color-primary-light
  border-radius: 16px
  display: inline-block
  line-height: 20px
  img
    height: 16px
    vertical-align: middle

</style>
