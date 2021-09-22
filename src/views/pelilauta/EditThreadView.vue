<template>
  <div class="editThread singleColumnLayout">
    <ThreadEditor
      :threadid="threadid"
      :topic="topic"
    />
  </div>
</template>

<script lang="ts">
import ThreadEditor from '@/components/thread/ThreadEditor.vue'
import { defineComponent } from 'vue'

/**
 * A Router view for editing or adding a new thread to stream(s)
 *
 * Does not contain any functionality aside from shared state initialization
 * and layout
 */
export default defineComponent({
  name: 'EditThread',
  components: {
    ThreadEditor
  },
  props: {
    threadid: {
      type: String,
      required: false,
      default: ''
    },
    topic: {
      type: String,
      required: false,
      default: 'Yleinen'
    }
  }
})
</script>
