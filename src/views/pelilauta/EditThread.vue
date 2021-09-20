<template>
  <div class="editThread singleColumnLayout">
    <ThreadEditor
      :thread="thread"
      :mode="mode"
      :topic="topic"
    />
  </div>
</template>

<script lang="ts">
import ThreadEditor from '@/components/thread/ThreadEditor.vue'
import { useSite } from '@/state/site'
import { useThreads } from '@/state/threads/threads'
import { defineComponent, onMounted, watch } from 'vue'

/**
 * A Router view for a Stream Thread in an edit mode.
 *
 * Loads all the required State entities, and initiates the required Firebase
 * subscriptions.
 * Does not contain any functionality aside from state management and component
 * import/layout
 */
export default defineComponent({
  name: 'EditThread',
  components: {
    ThreadEditor
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
    },
    topic: {
      type: String,
      required: false,
      default: 'Yleinen'
    }
  },
  setup (props) {
    const { subscribeThread, thread } = useThreads()
    subscribeThread(props.threadid)

    onMounted(() => {
      watch(thread, (t) => {
        if (t.site) {
          // The thread is linked to a site, lets update the state to
          // use the linked site.
          useSite(t.site)
        }
      })
    })

    return { thread }
  }
})
</script>
