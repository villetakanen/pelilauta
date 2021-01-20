<template>
  <div>
    <div
      v-if="isAuthz"
      class="reply-form"
    >
      <Editor
        v-model="reply"
        :lines="3"
        class="box"
      />
      <MaterialButton
        icon
        class="button"
        color="secondary"
        :action="send"
      >
        <img
          src="@/assets/send.svg"
          alt="Send comment"
        >
      </MaterialButton>
    </div>
    <div
      v-if="!isAuthz"
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
import { useDiscussion } from '@/lib/discussion'
import { useAuthState, useProfile } from '@/state/authz'
import { extractLinks, Quote } from '@/utils/contentFormat'

export default defineComponent({
  name: 'ReplyForm',
  components: {
    MaterialButton,
    Editor
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
    const { isAuthz, uid } = useAuthState()
    const reply = ref('')

    const send = () => {
      const { addComment } = useDiscussion(props.threadid)
      const { profile } = useProfile()
      const { formattedContent } = extractLinks(reply.value)
      addComment(uid.value, profile.value.nick, formattedContent)
      reply.value = ''
    }

    onMounted(() => {
      watch(() => props.quoted, (val) => {
        console.log('quote:', val)
        reply.value = reply.value + '<div class="quoteReply"><div class="reply">' + val.content + '</div><div class="replyAuthor">' + val.author + '</div></div><div><br/></div>'
      })
    })

    return { reply, send, isAuthz }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.reply-form
  @include BoxShadow1()
  background-color: rgba($color-fill-primary-dark, 0.22)
  margin: 8px
  padding: 7px
  border-radius: 8px
  border: solid 1px rgba($color-fill-tertiary, 0.11)
  position: relative
  .box
    flex-grow: 1
    flex-shrink: 0
    margin-right: 8px
    border-radius: 4px
    background-color: $color-base-dark
    border: none
    padding: 4px
    min-height: 60px
    max-height: 220px
    line-height: 20px
    margin-right: 70px
    overflow: auto
  .box:after
    content: ""
    position: absolute
    border-style: solid
    border-color: transparent $color-base-dark
    top: 7px // controls vertical position
    right: 64px // value = - border-left-width - border-right-width */
    border-width: 0px 0px 16px 16px
    bottom: auto
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
