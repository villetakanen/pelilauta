<template>
  <div
    v-if="showMemberTools"
    class="ReplyForm"
  >
    <div
      class="TypeCaption"
      style="margin-bottom: 4px"
    >
      {{ $t('discuss.reply.title') }}
    </div>
    <div style="display: flex; gap: 8px; margin-bottom: 12px">
      <ReplyEditor
        v-model:content="reply"
        class="commentField richText"
        :disabled="sending"
        @mention="mention($event)"
      />
      <transition name="appear">
        <AddImageReplyAction
          class="AddImageFab"
          @uploaded="addImageToEditor($event)"
        />
      </transition>
      <Fab3
        icon="send"
        secondary
        small
        :label="$t('action.send')"
        :disabled="sending"
        @click="send"
      />
    </div>
    <EditorHelp />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, Ref, provide, computed } from 'vue'
import ReplyEditor from '../ReplyEditor.vue'
import { addReply } from '@/state/discussion'
import { useAuth } from '@/state/authz'
import { extractLinks, Quote } from '@/utils/contentFormat'
import AddImageReplyAction from '../AddImageReplyAction.vue'
import EditorHelp from '../EditorHelp.vue'
import Fab3 from '@/components/material3/Fab3.vue'

export default defineComponent({
  name: 'ReplyForm',
  components: {
    ReplyEditor,
    AddImageReplyAction,
    EditorHelp,
    Fab3
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
@import @/styles/material-typography.sass
@import @/styles/box-shadow.sass

div.ReplyForm
  .commentField
    background-color: var(--chroma-secondary-i)
    padding: 6px 16px
    border: solid 1px var(--chroma-secondary-h)
    border-radius: 18px
    flex-grow: 1
    transition: all 0.5s

</style>
