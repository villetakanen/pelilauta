<template>
  <div class="threadEditor">
    <TextField
      v-model="v.threadTitle.$model"
      header
      :label="$t('threads.title')"
      :error="v.threadTitle.$error"
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
      <MaterialButton
        id="threadEditorCancelButton"
        text
        :to="threadid ? `/thread/${threadid}/view` : '/'"
      >
        {{ $t('action.cancel') }}
      </MaterialButton>
      <MaterialButton
        :async-action="save"
      >
        {{ $t('action.send') }}
      </MaterialButton>
    </div>
  </div>
</template>

<script lang="ts">
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { computed, defineComponent, onMounted, ref } from 'vue'
import TextField from '../material/TextField.vue'
import { maxLength } from '@/utils/contentFormat'
import RichTextEditor from '../quill/RichTextEditor.vue'
import MaterialButton from '../material/MaterialButton.vue'
import TopicSelector from './TopicSelector.vue'
import { useThreads } from '@/state/threads'

/**
 * An form for editing and creating threads
 */
export default defineComponent({
  name: 'ThreadEditor',
  components: {
    TextField,
    RichTextEditor,
    MaterialButton,
    TopicSelector
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
    }
  },
  setup (props) {
    console.log('ThreadEditor setup with', props.threadid, props.topic)
    const { thread, subscribeThread } = useThreads()

    const createANewThread = computed(() => (!props.threadid))
    const originalThread = computed(() => (thread.value))
    const siteid = computed(() => (thread.value.site ?? ''))

    onMounted(() => {
      subscribeThread(props.threadid)
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

    const rules = {
      threadTitle: { required, maxLength },
      threadContent: { required }
    }
    const v = useVuelidate(rules, { threadTitle, threadContent })

    async function save () {
      console.debug('threadEditor saving', dirtyTitle.value, dirtyTopic.value, dirtyContent.value)
    }

    return {
      createANewThread,
      threadTopic,
      siteid,
      save,
      v
    }
  }
})
</script>

<style lang="sass" scoped>
.editorActions, .contentEditor
  margin-top: 8px
</style>
