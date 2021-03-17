<template>
  <div class="threadEditor">
    <div class="threadHeader toolbar">
      <TextField
        v-model="v.threadTitle.$model"
        class="field"
        header
        :label="$t('threads.title')"
        :error="v.threadTitle.$error"
      />
      <MaterialSelect
        v-model="v.threadTopic.$model"
        class="field"
        :opts="topicOpts"
        :label="$t('threads.topic')"
      />
      <MaterialButton
        icon
        :action="toggle"
      >
        <Icon name="equalizer" />
      </MaterialButton>
    </div>

    <transition name="rollin">
      <div
        v-if="toggleSettings"
        class="additionalFields toolbar"
      >
        <Toggle
          v-model="threadSticky"
          :label="$t('thread.stickyToggle')"
        />
        <Toggle v-if="false" :label="$t('thread.pushToStream')" />
        <div class="spacer" />
        <MaterialSelect
          v-if="false"
          class="field"
          :opts="topicOpts"
          label="Site / Game"
        />
      </div>
    </transition>

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
        id="threadEditorCancelButton"
        text
        :to="thread.id ? `/thread/${thread.id}/view` : '/'"
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
import { useMeta } from '@/state/meta'
import { createThread, Thread, updateThread } from '@/state/threads/threads'
import { computed, defineComponent, PropType, Ref, ref } from 'vue'
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
import Toggle from '../material/Toggle.vue'
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
    Icon,
    Toggle
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
    const toggleSettings = ref(false)
    const toggle = () => { toggleSettings.value = !toggleSettings.value }
    console.debug('thread', props.thread)
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
    // Thread content
    const localSticky:Ref<null|boolean> = ref(null)
    const threadSticky = computed({
      get: () => (localSticky.value === null ? props.thread.data.sticky || false : localSticky.value),
      set: (val:boolean) => {
        localSticky.value = val
      }
    })
    // Topics
    const { streams } = useMeta()
    const topicOpts = computed(() => (streams.value.filter((val) => (val.slug !== '-')).map((val) => ({ key: val.slug, value: val.name }))))
    const threadTopic = ref(props.topic || props.thread.data.topic || 'Yleinen')
    console.debug('ThreadEditor.vue', threadTopic.value)
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
      if (props.mode === 'new') {
        return createThread(uid.value, {
          content: localContent.value,
          title: localTitle.value,
          topic: threadTopic.value,
          sticky: threadSticky.value
        }).then((threadid) => {
          pushSnack(i18n.t('threads.updateSuccess'))
          router.push(`/thread/${threadid}/view`)
        }).catch((error:Error) => {
          pushSnack(i18n.t('threads.updateFailed'))
          console.debug(error)
        })
      }
      const updatedThread:Thread = { ...props.thread }
      if (localContent.value) updatedThread.data.content = localContent.value
      if (localTitle.value) updatedThread.data.title = localTitle.value
      if (threadTopic.value) updatedThread.data.topic = threadTopic.value
      if (localSticky.value !== null) updatedThread.data.sticky = localSticky.value
      return updateThread(uid.value, updatedThread).then(() => {
        pushSnack(i18n.t('threads.updateSuccess'))
        router.push(`/thread/${props.thread.id}/view`)
      }).catch((error:Error) => {
        pushSnack(i18n.t('threads.updateFailed'))
        console.debug(error)
      })
    }
    return { threadContent, threadTitle, topicOpts, threadTopic, v, save, toggleSettings, toggle, threadSticky }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass
@import @/styles/include-media.scss
.editor
  border: solid 1px var(--color-fill-primary)
.threadHeader
  margin-bottom: 8px
  div
    margin: 0
  div+div
    margin: 0 8px
@include media('<tablet')
  .threadEditor
    .threadHeader
      display: block
      .field
        margin-bottom: 8px
        margin-left: 0
        min-width: calc(100vw - 112px)

.additionalFields
  border: solid 2px var(--chroma-primary-g)
  // background-color: var(--chroma-primary-h)
  padding: 4px
  margin-bottom: 4px
  line-height: 40px

.rollin-enter-active
  transition: all .5s

.rollin-leave-active
  transition: all .5s

.rollin-enter-from,
.rollin-leave-to
  opacity: 0

</style>
