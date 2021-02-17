<template>
  <div
    v-if="reply"
    :class="replyClasses"
    class="replyComment"
  >
    <!-- Top toolbar for the reply-card -->
    <div class="toolbar">
      <div class="author">
        <router-link :to="{ name: 'profile.public', params: { uid: reply.author }}">
          {{ nick }}
        </router-link>
      </div>

      <div class="spacer" />

      <LoveAReplyAction
        :count="reply.lovesCount"
        :loves="loves"
        :authorid="reply.author"
        :action="toggleLove"
      />

      <MaterialMenu
        v-model="menu"
        small
        style="float: right"
      />
    </div>

    <div
      v-if="!editReply"
      class="message"
    >
      <div
        :innerHTML="reply.content"
      />
    </div>
    <div
      v-if="editReply"
      class="message"
    >
      <Editor
        v-model="replyContent"
        :lines="3"
        class="box"
      />
      <MaterialButton
        icon
        class="button"
        color="secondary"
        :action="updateReply"
      >
        <img
          src="@/assets/send.svg"
          alt="send"
        >
      </MaterialButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, PropType } from 'vue'
import { useAuthz } from '@/lib/authz'
import MaterialMenu from '@/components/material/MaterialMenu.vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import { MenuItem } from '@/utils/uiInterfaces'
import { loveReply, unloveReply, updateReplyContent, subscribeToReplies, deleteReply } from '@/state/discussion'
import Editor from '@/components/quill/QuillEditor.vue'
import { useI18n } from 'vue-i18n'
import LoveAReplyAction from './LoveAReplyAction.vue'
import { Reply } from '@/utils/firestoreInterfaces'
import { useAuthors } from '@/lib/authors'
import { useAuthState } from '@/state/authz'

export default defineComponent({
  components: {
    MaterialMenu,
    Editor,
    MaterialButton,
    LoveAReplyAction
  },
  props: {
    reply: {
      type: Object as PropType<Reply>,
      required: true
    },
    threadid: {
      type: String,
      required: true
    }
  },
  emits: ['quote'],
  setup (props, context) {
    const { uid, isAuthz } = useAuthz()
    const { isAdmin } = useAuthState()
    const { authors } = useAuthors()

    const nick = computed(() => (authors.value.find((a) => (a.uid === props.reply.author))?.nick))

    subscribeToReplies(props.threadid)
    const editReply = ref(false)
    const replyContent = computed(() => (props.reply.content))

    const replyClasses = computed(() => ({
      fromMe: props.reply.author === uid.value
    }))

    const dropComment = () => {
      deleteReply(props.threadid, props.reply.replyid)
    }

    const editComment = () => {
      editReply.value = true
    }

    const loves = computed(() => {
      return props.reply?.lovers?.includes(uid.value)
    })

    async function toggleLove () {
      if (!isAuthz) return
      if (loves.value) return unloveReply(uid.value, props.threadid, props.reply.replyid)
      else return loveReply(uid.value, props.threadid, props.reply.replyid)
    }

    const quoteComment = () => {
      context.emit('quote', {
        content: props.reply.content,
        author: authors.value.find((a) => (a.uid === props.reply.author))?.nick
      })
    }

    const i18n = useI18n()

    const menu = computed(() => {
      const arr = new Array<MenuItem>()
      arr.push({ action: quoteComment, text: i18n.t('action.quote') })
      if (uid.value === props.reply?.author) {
        arr.push({ action: dropComment, text: 'Delete!' })
        arr.push({ action: editComment, text: 'Edit' })
      } else if (isAdmin.value) {
        arr.push({ action: dropComment, text: 'Delete!', admin: true })
      }
      return arr
    })

    const updateReply = () => {
      editReply.value = false
      updateReplyContent(uid.value, props.threadid, props.reply.replyid, replyContent.value)
    }

    return { menu, replyClasses, uid, loves, toggleLove, editReply, replyContent, updateReply, nick }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass
@import @/styles/material-colors.sass
@import @/styles/layout.sass

.replyComment
  @include TypeBody2()
  @include DontBreakOut()
  position: relative
  background-color: rgba($color-fill-primary-dark, 0.22)
  margin: 8px 4px
  padding: 16px
  border-radius: 0 8px 8px 8px
  // for triangle
  margin-left: 16px
  color: rgba($color-fill-tertiary, 0.83)
  &.fromMe
    margin-left: 8px
    margin-right: 16px
    background-color: rgba($color-fill-primary, 0.22)
    //border: solid 1px rgba($color-fill-primary, 0.22)
    border-radius: 8px 0px 8px 8px
  .message
    margin-top:8px

.author
  color: $color-fill-primary-dark
  font-weight: bold
.fromMe .author
  color: rgba($color-fill-tertiary, 0.83)

.replyComment:after
  content: ""
  position: absolute
  border-style: solid
  border-color: transparent rgba($color-fill-primary-dark, 0.22)

.replyComment:not(.fromMe):after
  top: 0px // controls vertical position
  left: -16px // value = - border-left-width - border-right-width */
  border-width: 0px 16px 16px 0
  bottom: auto

.replyComment.fromMe:after
  top: 0px // controls vertical position
  right: -16px // value = - border-left-width - border-right-width */
  border-width: 0px 0px 16px 16px
  bottom: auto
  border-color: transparent rgba($color-fill-primary, 0.22)

.stream-reply
  @include TypeBody2()
  margin: 8px

#app #mainContentWrapper main
  p.caption
    padding-bottom: 4px
  div.stream-reply
    padding-top: 8px
    div.author
      font-weight: 500
      margin:0
      margin-right: 8px
      padding:4px 0
      line-height: 16px
      color: $color-fill-primary-light
      flex-grow: 0
.box
  position: relative
  margin-right: 8px
  border-radius: 4px
  background-color: $color-base
  border: solid 1px $color-base
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
    border-color: transparent white
    top: 16px // controls vertical position
    right: 64px // value = - border-left-width - border-right-width */
    border-width: 8px 0px 8px 16px
    bottom: auto
.button
    position: absolute
    right: 8px
    bottom: 22px
</style>
