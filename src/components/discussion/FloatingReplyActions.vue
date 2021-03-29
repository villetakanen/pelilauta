<template>
  <teleport to="#replyActionsContainer">
    <div
      v-if="!isAnonymous"
      id="floatingReplyActions"
      :class="{active: replyContent.length > 0, passive: replyContent.length === 0}"
    >
      <div class="editorContainer">
        <span class="placeholder">{{ $t('replyEditor.placeholderText') }}</span>
        <ReplyEditor
          v-model:content="replyContent"
          class="replyEditor contentBox"
          :disabled="sending"
        />
        <Icon
          class="editorAction"
          medium
          name="addAnImage"
          dark
        />
      </div>
      <Fab
        class="sendAction"
        :async-action="send"
      >
        <Icon
          dark
          name="send"
        />
      </Fab>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import Icon from '../material/Icon.vue'
import Fab from '../material/Fab.vue'
import ReplyEditor from './ReplyEditor.vue'
import { addReply } from '@/state/discussion'
import { extractLinks } from '@/utils/contentFormat'
import { Thread } from '@/state/threads'
import { useAuthState } from '@/state/authz'

export default defineComponent({
  name: 'FloatingReplyAction',
  components: { Icon, Fab, ReplyEditor },
  props: {
    thread: {
      type: Object as PropType<Thread>,
      required: true
    }
  },
  setup (props) {
    const replyContent = ref('')
    const sending = ref(false)
    const { isAnonymous, uid } = useAuthState()

    const send = async () => {
      const { formattedContent } = extractLinks(replyContent.value)
      sending.value = true
      return addReply(props.thread.id, uid.value, formattedContent).then(() => {
        console.log('got here?')
        replyContent.value = ''
      }).finally(() => {
        sending.value = false
      })
    }

    return { isAnonymous, sending, replyContent, send }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/box-shadow.sass

#floatingReplyActions
  @include Rise4()
  width: 100vw
  height: 56px
  background-color: var(--chroma-secondary-a)
  display: flex
  box-sizing: border-box
  padding: 8px
  padding-left: max(8px, calc((100vw - 820px)/2))
  padding-right: max(8px, calc((100vw - 820px)/2 + 56px))
  transition: 0.3s
  .sendAction
    position: absolute
    bottom: 8px
    right: max(8px, calc((100vw - 820px)/2 + 56px))
    @include Halo8()
  .editorContainer
    background-color: var(--chroma-secondary-c)
    border: solid 1px var(--chroma-secondary-f)
    border-radius: 20px
    position: relative
    flex-grow: 1
    transition: 0.3s
    margin-right: 64px
#floatingReplyActions:focus-within,
#floatingReplyActions.active
  height: calc(3 * 24px + 16px + 16px)
  .placeholder, .editorAction
    display: none
  .editorContainer
    height: calc(3 * 24px + 16px)
    border-radius: 16px
#floatingReplyActions.passive:not(:focus-within)
  .editorContainer
    height: 40px
  .placeholder
    display: block
    font-style: italic
    color: var(--chroma-secondary-f)
    position: absolute
    top: 8px
    left: 16px

.editorAction
  opacity: 75%
  position: absolute
  top: -4px
  right: 4px

</style>
