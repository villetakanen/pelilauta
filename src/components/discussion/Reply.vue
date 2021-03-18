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
        class="contentArea comment contentBox"
        :innerHTML="reply.content"
      />
    </div>
    <div
      v-if="editReply"
      class="message"
    >
      <ReplyEditor
        v-model:content="replyContent"
        class="box"
      />
      <Fab
        class="button"
        :async-action="updateReply"
        color="tertiary"
      >
        <Icon
          name="send"
          color="dark"
        />
      </Fab>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, PropType } from 'vue'
import MaterialMenu from '@/components/material/MaterialMenu.vue'
import { MenuItem } from '@/utils/uiInterfaces'
import { loveReply, unloveReply, updateReplyContent, subscribeToReplies, deleteReply } from '@/state/discussion'
import { useI18n } from 'vue-i18n'
import LoveAReplyAction from './LoveAReplyAction.vue'
import { Reply } from '@/utils/firestoreInterfaces'
import { useAuthors } from '@/state/authors'
import { useAuthState } from '@/state/authz'
import ReplyEditor from './ReplyEditor.vue'
import Fab from '../material/Fab.vue'
import Icon from '../material/Icon.vue'

export default defineComponent({
  components: {
    MaterialMenu,
    LoveAReplyAction,
    ReplyEditor,
    Fab,
    Icon
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
    const { uid, isAnonymous } = useAuthState()
    const { isAdmin } = useAuthState()
    const { authors } = useAuthors()

    const nick = computed(() => (authors.value.find((a) => (a.uid === props.reply.author))?.nick))

    subscribeToReplies(props.threadid)
    const editReply = ref(false)
    const localReplyContent = ref('')
    const replyContent = computed({
      get: () => (localReplyContent.value || props.reply.content),
      set: (val) => { localReplyContent.value = val }
    })

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
      if (isAnonymous.value) return
      if (loves.value) return unloveReply(uid.value, props.threadid, props.reply.replyid)
      else return loveReply(uid.value, props.threadid, props.reply.replyid)
    }

    const quoteComment = () => {
      const el = document.createElement('div')
      el.innerHTML = props.reply.content
      context.emit('quote', {
        content: el.textContent,
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

    const updateReply = async () => {
      editReply.value = false
      return updateReplyContent(uid.value, props.threadid, props.reply.replyid, replyContent.value)
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
  background-color: #{'rgba(var(--chroma-secondary-g-rgb), 0.22)'}
  margin: 8px 4px
  padding: 16px
  border-radius: 0 8px 8px 8px
  // for triangle
  margin-left: 16px
  color: var(--chroma-secondary-a)
  &.fromMe
    margin-left: 8px
    margin-right: 16px
    background-color: #{'rgba(var(--chroma-primary-c-rgba), 0.22)'}
    border-radius: 8px 0px 8px 8px
  .message
    margin-top:8px
  .comment
    hyphens: auto
    word-break: break-word
    a
      word-break: break-all

.author
  font-weight: bold
  a
    text-decoration: none
    color: var(--chroma-secondary-d)
.fromMe .author
  a
    color: var(--chroma-primary-d)

.replyComment:after
  content: ""
  position: absolute
  border-style: solid
  border-color: transparent #{'rgba(var(--chroma-secondary-g-rgb), 0.22)'}

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
  border-color: transparent #{'rgba(var(--chroma-primary-c-rgba), 0.22)'}

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
