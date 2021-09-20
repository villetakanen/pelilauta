<template>
  <div class="threadEditor">
    <p class="details">
      {{ v.threadTopic.$model }} <span v-if="threadSite">/ {{ threadSite }}</span>
    </p>
    <div class="threadHeader toolbar">
      <TextField
        v-model="v.threadTitle.$model"
        class="field"
        header
        :label="$t('threads.title')"
        :error="v.threadTitle.$error"
      />
      <HamburgerMenuButton v-model="toggleMenu" />
    </div>
    <div
      class="drawer toolbar"
      :class="{ closed: !toggleMenu }"
    >
      <MaterialSelect
        v-model="v.threadTopic.$model"
        class="field"
        :opts="topicOpts"
        :label="$t('threads.topic')"
      />
      <MaterialButton
        icon
        :action="toggleInjectMedia"
      >
        <Icon name="youtube" />
      </MaterialButton>
      <MaterialSelect
        v-model="threadSite"
        class="field"
        :opts="siteList"
        label="Site / Game"
      />
      <Toggle
        v-model="threadSticky"
        :label="$t('thread.stickyToggle')"
      />
      <Toggle
        v-if="false"
        :label="$t('thread.pushToStream')"
      />
    </div>
    <transition name="rollin">
      <div
        v-if="toggleMedia"
      >
        <MediaTool :thread="thread" />
      </div>
    </transition>

    <RichTextEditor
      v-model="threadContent"
    />

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
import { createThread, updateThread } from '@/state/threads/threads'
import { Thread } from '@/utils/firestoreInterfaces'
import { computed, defineComponent, PropType, Ref, ref } from 'vue'
import MaterialSelect from '../material/MaterialSelect.vue'
import TextField from '../material/TextField.vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import MaterialButton from '../material/MaterialButton.vue'
import Icon from '../material/Icon.vue'
import { useAuth } from '@/state/authz'
import { useSnack } from '@/composables/useSnack'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Toggle from '../material/Toggle.vue'
import { useSites } from '@/state/sites'
import MediaTool from './MediaTool.vue'
import RichTextEditor from '../quill/RichTextEditor.vue'
import HamburgerMenuButton from '../material/HamburgerMenuButton.vue'
/**
 * An editor form for Thread data.
 */
export default defineComponent({
  name: 'ThreadEditor',
  components: {
    TextField,
    MaterialSelect,
    MaterialButton,
    Icon,
    Toggle,
    MediaTool,
    RichTextEditor,
    HamburgerMenuButton
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
    const toggleMenu = ref(false)
    const toggleSettings = ref(false)
    const toggle = () => { toggleSettings.value = !toggleSettings.value }
    const toggleMedia = ref(false)
    const toggleInjectMedia = () => { toggleMedia.value = !toggleMedia.value }
    // Thread name
    const localTitle = ref('')
    const threadTitle = computed({
      get: () => (localTitle.value || props.thread.data.title),
      set: (val:string) => {
        if (val !== localTitle.value) {
          localTitle.value = val
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
    const threadTopic = ref(props.thread.data.topic || props.topic || 'Yleinen')
    const minLength = (value:unknown) => (typeof value === 'string' && value.length > 1)
    const maxLength = (value:unknown) => (typeof value === 'string' && value.toString().trim().length < 36)
    const rules = {
      threadTitle: { required, minLength, maxLength },
      threadTopic: { required }
    }
    const v = useVuelidate(rules, { threadTitle, threadTopic })
    const { user } = useAuth()
    const { pushSnack } = useSnack()
    const i18n = useI18n()
    const router = useRouter()
    const save = async () => {
      if (props.mode === 'new') {
        return createThread(user.value.uid, {
          content: localContent.value,
          title: localTitle.value,
          topic: threadTopic.value,
          sticky: threadSticky.value
        }).then((threadid) => {
          pushSnack(i18n.t('snacks.updateSuccess'))
          router.push(`/thread/${threadid}/view`)
        }).catch((error:Error) => {
          pushSnack(i18n.t('snacks.updateFailed'))
          console.debug(error)
        })
      }
      const updatedThread:Thread = { ...props.thread }
      if (localContent.value) updatedThread.data.content = localContent.value
      if (localTitle.value) updatedThread.data.title = localTitle.value
      if (threadTopic.value) updatedThread.data.topic = threadTopic.value
      if (localSticky.value !== null) updatedThread.data.sticky = localSticky.value
      if (threadSite.value !== null) updatedThread.site = threadSite.value
      return updateThread(user.value.uid, updatedThread).then(() => {
        pushSnack(i18n.t('snacks.updateSuccess'))
        router.push(`/thread/${props.thread.id}/view`)
      }).catch((error:Error) => {
        pushSnack(i18n.t('snacks.updateFailed'))
        console.debug(error)
      })
    }

    const threadSite:Ref<string|null> = ref(null)
    const { allSites } = useSites()
    const mySites = computed(() => (allSites.value.filter((val) => (Array.isArray(val.owners)) && val.owners.includes(user.value.uid))))
    const siteList = computed(() => {
      const list = [{ key: '-', value: '-' }]
      list.pop()
      mySites.value.forEach((site) => {
        list.push({ key: site.id, value: site.name })
      })
      return list
    })

    return { toggleMenu, threadContent, threadTitle, topicOpts, threadTopic, v, save, toggleSettings, toggle, threadSticky, siteList, threadSite, toggleInjectMedia, toggleMedia }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass
@import @/styles/include-media.scss

.threadEditor
  padding-top: 8px
  .details
    @include TypeCaption()

.drawer
  transition: all 200ms ease-in-out
  max-height: 200px
  overflow: hidden
  background-color: var(--color-b-i)
  padding: 8px 16px
  margin: 0 -16px
  box-shadow: inset 0px 0px 16px 0px var(--color-b-f)
  border-top: solid 1px var(--color-b-f)
  border-bottom: solid 1px var(--color-b-f)
  opacity: 1
  flex-wrap: wrap
  gap: 4px
  &.closed
    max-height: 0px
    padding: 0 16px
    margin: 0 -16px
    border: none
    opacity: 0

@include media('<tablet')
  .threadEditor
    .threadHeader
      .field
        margin-bottom: 8px
        margin-left: 0
        width: calc(100vw - 78px)
    .drawer
      .field
        width: calc(100vw - 144px)
        flex-grow: 1
      div
        margin-left: 0
        margin-right: 0

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
