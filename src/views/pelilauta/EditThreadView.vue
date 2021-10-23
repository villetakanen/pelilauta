<template>
  <div class="editThread">
    <EditThreadHeader
      :threadid="threadid"
      @addVideoLink="showVideoLinker=true"
    />
    <ThreadEditor
      class="singleColumnLayout"
      :threadid="threadid"
      :topic="topic"
      :show-video-linker="showVideoLinker"
    />
  </div>
</template>

<script lang="ts">
import EditThreadHeader from '@/components/thread/editor/EditThreadHeader.vue'
import ThreadEditor from '@/components/thread/ThreadEditor.vue'
import { useThreads } from '@/state/threads'
import { defineComponent, onMounted, ref, watch } from 'vue'
import { getAnalytics, logEvent } from '@firebase/analytics'

/**
 * A Router view for editing or adding a new thread to stream(s)
 *
 * Does not contain any functionality aside from shared state initialization
 * and layout
 */
export default defineComponent({
  name: 'EditThread',
  components: {
    ThreadEditor,
    EditThreadHeader
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
  },
  setup (props) {
    const showVideoLinker = ref(false)
    if (props.threadid) {
      const { subscribeThread } = useThreads()

      subscribeThread(props.threadid)

      onMounted(() => {
        watch(() => props.threadid, (threadid) => {
          subscribeThread(threadid)
        }, { immediate: true })

        logEvent(getAnalytics(),
          'EditThread', {
            threadid: props.threadid
          })
      })
    }
    return { showVideoLinker }
  }
})
</script>
