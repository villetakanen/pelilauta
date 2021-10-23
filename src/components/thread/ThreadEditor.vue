<template>
  <main class="threadEditor">
    <section>
      <Textfield
        v-model="v.threadTitle.$model"
        :label="$t('threads.title')"
        :error="v.threadTitle.$error"
        class="titleField"
      />
      <MediaTool
        v-if="showVideoLinker"
        v-model="threadSlug"
      />
      <RichTextEditor
        v-model:content="v.threadContent.$model"
        class="contentEditor"
        :error="v.threadContent.$error"
      />
      <div
        class="toolbar editorActions"
      >
        <TopicSelector v-model="threadTopic" />
        <div class="spacer" />
        <Button
          id="threadEditorCancelButton"
          text
          @click="reroute(threadid ? `/thread/${threadid}/view` : '/')"
        >
          {{ $t('action.cancel') }}
        </Button>
        <Button
          @click="save()"
        >
          {{ $t('action.send') }}
        </Button>
      </div>
    </section>
  </main>
</template>

<script lang="ts">
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { computed, defineComponent, onMounted, ref } from 'vue'
import Textfield from '../form/Textfield.vue'
import { maxLength } from '@/utils/contentFormat'
import RichTextEditor from '../quill/RichTextEditor.vue'
import TopicSelector from './TopicSelector.vue'
import { useThreads } from '@/state/threads'
import { useSite } from '@/state/site'
import { PostData } from '@/utils/firestoreInterfaces'
import { useRouter } from 'vue-router'
import MediaTool from './MediaTool.vue'
import { useUxActions } from '@/composables/useUxActions'
import Button from '../form/Button.vue'

/**
 * An form for editing and creating threads
 */
export default defineComponent({
  name: 'ThreadEditor',
  components: {
    Textfield,
    RichTextEditor,
    TopicSelector,
    MediaTool,
    Button
  },
  props: {
    threadid: {
      type: String,
      required: false,
      default: ''
    },
    topic: {
      type: String,
      required: true
    },
    showVideoLinker: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup (props) {
    console.log('ThreadEditor setup with', props.threadid, props.topic)
    const { thread, subscribeThread, createThread, updateThread } = useThreads()
    const router = useRouter()

    const createANewThread = computed(() => (!props.threadid))
    const originalThread = computed(() => (thread.value))
    const siteid = computed(() => (thread.value.site ?? ''))

    const { reroute } = useUxActions()

    onMounted(() => {
      subscribeThread(props.threadid)
      if (siteid.value) {
        useSite(siteid.value)
      }
    })

    const dirtyTitle = ref('')
    const threadTitle = computed({
      get: () => (dirtyTitle.value || originalThread.value.data.title || ''),
      set: (val: string) => {
        if (val !== dirtyTitle.value) {
          dirtyTitle.value = val
        }
      }
    })
    const dirtyContent = ref('')
    const threadContent = computed({
      get: () => (dirtyContent.value || originalThread.value.data.content || ''),
      set: (val: string) => {
        if (val !== dirtyContent.value) {
          dirtyContent.value = val
        }
      }
    })
    const dirtyTopic = ref('')
    const threadTopic = computed({
      get: () => (dirtyTopic.value || originalThread.value.data.topic || props.topic),
      set: (val: string) => {
        if (val !== dirtyTopic.value) {
          dirtyTopic.value = val
        }
      }
    })

    const dirtySlug = ref('')
    const threadSlug = computed({
      get: () => (dirtySlug.value || originalThread.value.data.youTubeSlug || ''),
      set: (val: string) => {
        if (val !== dirtySlug.value) {
          dirtySlug.value = val
        }
      }
    })

    const rules = {
      threadTitle: { required, maxLength },
      threadContent: { required }
    }
    const v = useVuelidate(rules, { threadTitle, threadContent })

    async function save () {
      console.debug('threadEditor saving', dirtyTitle.value, dirtyTopic.value, dirtyContent.value)
      const data:PostData = {
        title: threadTitle.value,
        topic: threadTopic.value,
        content: threadContent.value
      }
      if (dirtySlug.value) data.youTubeSlug = dirtySlug.value
      if (createANewThread.value) {
        const id = await createThread(data)
        router.push(`/thread/${id}/view`)
      } else {
        await updateThread(props.threadid, data)
        router.push(`/thread/${props.threadid}/view`)
      }
    }

    return {
      createANewThread,
      threadTopic,
      threadSlug,
      siteid,
      save,
      v,
      reroute
    }
  }
})
</script>

<style lang="sass" scoped>
.titleField+.contentEditor
  margin-top: 12px
</style>
