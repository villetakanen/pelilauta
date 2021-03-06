<template>
  <div class="replyForm">
    <!-- Show the form only for non-frozen logged in users -->
    <div
      v-if="!isAnonymous"
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
      v-if="isAnonymous"
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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, Ref, watch, provide } from 'vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import ReplyEditor from './ReplyEditor.vue'
import { addReply } from '@/state/discussion'
import { useAuthState } from '@/state/authz'
import { extractLinks, Quote } from '@/utils/contentFormat'
import Fab from '../material/Fab.vue'
import AddImageReplyAction from './AddImageReplyAction.vue'

export default defineComponent({
  name: 'ReplyForm',
  components: {
    MaterialButton,
    ReplyEditor,
    Fab,
    AddImageReplyAction
  },
  props: {
    threadid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { isAnonymous, uid } = useAuthState()
    const reply = ref('')
    const sending = ref(false)
    const addImageDialog = ref(true)
    const mentions = ref(new Set<string>())

    const send = async () => {
      const { formattedContent } = extractLinks(reply.value)
      sending.value = true
      const m = [...mentions.value]
      return addReply(props.threadid, uid.value, formattedContent, m).then(() => {
        reply.value = ''
        mentions.value.clear()
      }).finally(() => {
        sending.value = false
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addImageToEditor = (a: any) => {
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

    return { reply, send, isAnonymous, quotedContent, sending, addImageDialog, addImageToEditor, mentions, mention }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass
@import @/styles/box-shadow.sass

.addAnImage
  position: absolute
  z-index: +100
  right: 80px

.reply-form
  background-color: #{'rgba(var(--chroma-secondary-c-rgb), 0.4)'}
  margin: 8px
  padding: 8px
  border-radius: 8px
  position: relative
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
