<template>
  <div class="replyForm">
    <!-- Show the form only for non-frozen logged in users -->
    <div
      v-if="showMemberTools"
      class="reply-form"
    >
      <AddImageReplyAction
        class="addAnImage"
        @uploaded="addImageToEditor($event)"
      />

      <ReplyEditor
        v-model:content="reply"
        class="box contentBox"
        :disabled="sending"
        @mention="mention($event)"
      />
      <Fab
        class="button"
        :async-action="send"
        icon="send"
        dark
      />
    </div>
    <div
      v-if="!showMemberTools"
      style="text-align: center;padding: 16px"
    >
      {{ $t('global.messages.pleaseLogin') }}
      <MaterialButton
        to="/login"
        text
      >
        {{ $t('action.login') }}
      </MaterialButton>
    </div>
    <EditorHelp />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, Ref, provide } from 'vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import ReplyEditor from './ReplyEditor.vue'
import { addReply } from '@/state/discussion'
import { useAuth } from '@/state/authz'
import { extractLinks, Quote } from '@/utils/contentFormat'
import Fab from '../material/Fab.vue'
import AddImageReplyAction from './AddImageReplyAction.vue'
import EditorHelp from './EditorHelp.vue'

export default defineComponent({
  name: 'ReplyForm',
  components: {
    MaterialButton,
    ReplyEditor,
    Fab,
    AddImageReplyAction,
    EditorHelp
  },
  props: {
    threadid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { user, showMemberTools } = useAuth()
    const reply = ref('')
    const sending = ref(false)
    const mentions = ref(new Set<string>())

    const send = async () => {
      const { formattedContent } = extractLinks(reply.value)
      sending.value = true
      const m = [...mentions.value]
      return addReply(props.threadid, user.value.uid, formattedContent, m).then(() => {
        reply.value = ''
        mentions.value.clear()
      }).finally(() => {
        sending.value = false
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addImageToEditor = (a: any) => {
      console.debug('addImageToEditor', a)
      imageToEditor.value = a
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mention = (a: string) => {
      mentions.value.add(a)
    }

    const imageToEditor = ref('')
    provide('imageToEditor', imageToEditor)

    const quotedContent = inject('quotedContent') as Ref<Quote>
    provide('quotedContent', quotedContent)

    return { reply, send, showMemberTools, quotedContent, sending, addImageToEditor, mentions, mention }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass
@import @/styles/box-shadow.sass

.reply-form
  background-color: #{'rgba(var(--chroma-secondary-c-rgb), 0.4)'}
  margin: 8px
  padding: 8px
  border-radius: 12px
  position: relative
  .addAnImage
    position: absolute
    z-index: +100
    right: 82px
    bottom: -24px
  .box
    flex-grow: 1
    flex-shrink: 0
    margin-right: 8px
    border-radius: 4px
    background-color: rgba(white, 0.5)
    border: none
    padding: 0px
    min-height: 60px
    max-height: 220px
    line-height: 20px
    margin-right: 70px
    overflow: auto
  .button
    @include BoxShadow8()
    position: absolute
    right: 15px
    bottom: 15px

p.cap.caption
  margin-top: 4px
  margin-left: 8px
  padding-left: 8px

</style>
