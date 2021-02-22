<template>
  <div class="viewThread">
    <ThreadBox>
      <ThreadCardHeader :thread="thread" />
      <div
        class="threadContent"
        :innerHTML="thread.data.content"
      />
      <PhotoBox :photos="thread.data.images || []" />
    </ThreadBox>
  </div>
</template>

<script lang="ts">
import PhotoBox from '@/components/stream/PhotoBox.vue'
import ThreadCardHeader from '@/components/stream/ThreadCardHeader.vue'
import ThreadBox from '@/components/thread/ThreadBox.vue'
import { subscribeThread, useThreads } from '@/state/threads/threads'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ViewThread',
  components: { ThreadBox, ThreadCardHeader, PhotoBox },
  props: {
    threadid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    subscribeThread(props.threadid)
    const { thread } = useThreads()
    return { thread }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

</style>
