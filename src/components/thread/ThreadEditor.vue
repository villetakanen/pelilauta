<template>
  <div class="threadEditor">
    <div class="threadHeader toolbar">
      <TextField
        v-model="v.threadTitle.$model"
        header
        :label="$t('threads.title')"
        :error="v.threadTitle.$error"
      />
      <MaterialSelect
        v-model="v.threadTopic.$model"
        :opts="topicOpts"
        :label="$t('threads.topic')"
      />
      <MaterialButton icon>
        <Icon name="toggle-open" />
      </MaterialButton>
    </div>

    <div class="editor">
      <QuillEditor
        v-model="threadContent"
        toolbar
      />
    </div>
    <div
      class="toolbar"
      style="margin-top:8px"
    >
      <div class="spacer" />
      <MaterialButton
        text
        :to="`/thread/${thread.id}/view`"
      >
        Cancel
      </MaterialButton>
      <MaterialButton :async-action="save">
        Save
      </MaterialButton>
    </div>
  </div>
</template>

<script lang="ts">
import { useMeta } from '@/state/meta'
import { Thread, updateThread } from '@/state/threads/threads'
import { computed, defineComponent, PropType, ref } from 'vue'
import MaterialSelect from '../material/MaterialSelect.vue'
import TextField from '../material/TextField.vue'
import QuillEditor from '../quill/QuillEditor.vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import MaterialButton from '../material/MaterialButton.vue'
import Icon from '../material/Icon.vue'
import { useAuthState } from '@/state/authz'
import { useSnack } from '@/composables/useSnack'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

/**
 * An editor form for Thread data.
 */
export default defineComponent({
  name: 'ThreadEditor',
  components: {
    TextField,
    MaterialSelect,
    QuillEditor,
    MaterialButton,
    Icon
  },
  props: {
    thread: {
      type: Object as PropType<Thread>,
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
      default: ''
    }
  },
  setup (props) {
    // Thread name
    const localTitle = ref('')
    const threadTitle = computed({
      get: () => (localTitle.value || props.thread.data.title),
      set: (val:string) => {
        if (val !== localTitle.value) {
          localTitle.value = val
        } else {
          console.debug('Trying to set thread title to itself. This is likely a bug.')
        }
      }
    })
    // Thread content
    const localContent = ref('')
    const threadContent = computed({
      get: () => (localContent.value || props.thread.data.content),
      set: (val:string) => {
        if (val !== localContent.value) {
          localContent.value = val
        } else {
          console.debug('Trying to set thread content to itself. This is likely a bug.')
        }
      }
    })
    // Topics
    const { streams } = useMeta()
    const topicOpts = computed(() => (streams.value.filter((val) => (val.slug !== '-')).map((val) => ({ key: val.slug, value: val.name }))))
    const threadTopic = ref(props.thread.data.topic)

    const minLength = (value:any) => (value.length > 1)
    const maxLength = (value:any) => (value.toString().trim().length < 36)

    const rules = {
      threadTitle: { required, minLength, maxLength },
      threadTopic: { required }
    }
    const v = useVuelidate(rules, { threadTitle, threadTopic })

    const { uid } = useAuthState()
    const { pushSnack } = useSnack()
    const i18n = useI18n()
    const router = useRouter()

    const save = async () => {
      const updatedThread:Thread = { ...props.thread }
      if (localContent.value) updatedThread.data.content = localContent.value
      if (localTitle.value) updatedThread.data.title = localTitle.value
      if (threadTopic.value) updatedThread.data.topic = threadTopic.value
      updateThread(uid.value, updatedThread).then(() => {
        pushSnack(i18n.t('threads.updateSuccess'))
        router.push(`/thread/${props.thread.id}/view`)
      }).catch((error:Error) => {
        pushSnack(i18n.t('threads.updateFailed'))
        console.debug(error)
      })
    }

    return { threadContent, threadTitle, topicOpts, threadTopic, v, save }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass

.editor
  border: solid 1px var(--color-fill-primary)
.threadHeader
  margin-bottom: 8px
  div
    margin: 0
  div+div
    margin: 0 8px
</style>
