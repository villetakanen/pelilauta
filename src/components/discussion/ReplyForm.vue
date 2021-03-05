<template>
  <div>
    <div
      v-if="!isAnonymous"
      class="reply-form"
    >
      <Editor
        v-model="reply"
        :lines="3"
        class="box"
      />
      <Fab
        class="button"
        :async-action="send"
        color="tertiary"
      >
        <Icon
          name="send"
          color="dark"
        />
      </Fab>
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
import { defineComponent, ref, PropType, onMounted, watch } from 'vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import Editor from '@/components/quill/QuillEditor.vue'
import { addReply } from '@/state/discussion'
import { useAuthState } from '@/state/authz'
import { extractLinks, Quote } from '@/utils/contentFormat'
import Fab from '../material/Fab.vue'
import Icon from '../material/Icon.vue'

export default defineComponent({
  name: 'ReplyForm',
  components: {
    MaterialButton,
    Editor,
    Fab,
    Icon
  },
  props: {
    threadid: {
      type: String,
      required: true
    },
    quoted: {
      type: Object as PropType<Quote>,
      required: false,
      default: { content: '', author: '' }
    }
  },
  setup (props) {
    const { isAnonymous, uid } = useAuthState()
    const reply = ref('')

    const send = async () => {
      const { formattedContent } = extractLinks(reply.value)
      return addReply(props.threadid, uid.value, formattedContent).then(() => {
        console.log('got here?')
        reply.value = ''
      })
    }

    onMounted(() => {
      watch(() => props.quoted, (val) => {
        console.log('quote:', val)
        reply.value = reply.value + '<div class="quoteReply"><div class="reply">' + val.content + '</div><div class="replyAuthor">' + val.author + '</div></div><div><br/></div>'
      })
    })

    return { reply, send, isAnonymous }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass
@import @/styles/box-shadow.sass

.reply-form
  background-color: #{'rgba(var(--chroma-primary-c-rgba), 0.44)'}
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
    padding: 4px
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
