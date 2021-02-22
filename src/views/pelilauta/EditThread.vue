<template>
  <div class="viewThread contentGrid">
    <ThreadBox>
      ...
    </ThreadBox>
  </div>
</template>

<script lang="ts">
import ThreadBox from '@/components/thread/ThreadBox.vue'
import { subscribeThread } from '@/state/threads/threads'
import { defineComponent } from 'vue'

/**
 * A Router view for a Stream Thread in an edit mode.
 *
 * Loads all the required State entities, and initiates the required Firebase
 * subscriptions.
 * Does not contain any functionality aside from state management and component
 * import/layout
 */
export default defineComponent({
  name: 'ViewThread',
  components: {
    ThreadBox
  },
  props: {
    threadid: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup (props) {
    subscribeThread(props.threadid)
  }
})
</script>
