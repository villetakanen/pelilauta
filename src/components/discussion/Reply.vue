<template>
  <div
    v-if="reply"
    :class="replyClasses"
    class="replyComment"
  >
    <!-- Top toolbar for the reply-card -->
    <div class="reply-header toolbar">
      <div class="author">
        {{ reply.nick }}
      </div>

      <div class="spacer" />

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
        :innerHTML="content"
      />
      <div
        class="toolbar"
      >
        <LoveAction
          v-if="author !== uid"
          :loved="loves"
          :action="toggleLove"
        />
        <img
          v-else
          src="@/assets/icons/action-love-hollow.svg"
          style="height:24px; opacity:0.5"
        >
        <div v-if="reply && reply.lovesCount && reply.lovesCount > 0">
          &nbsp;{{ reply.lovesCount }}
        </div>
        <span v-else>&nbsp;0</span>
        <div class="spacer" />
      </div>
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
        <img src="@/assets/send.svg">
      </MaterialButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import LoveAction from '@/components/app/LoveAction.vue'
import { useAuthz } from '@/lib/authz'
import MaterialMenu from '@/components/material/MaterialMenu.vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import { useMeta } from '@/lib/meta'
import { MenuItem } from '@/lib/stream'
import { useDiscussion } from '@/lib/discussion'
import { loveReply, unloveReply, updateReplyContent } from '@/state/discussions'
import Editor from '@/components/editor/Editor2.vue'

export default defineComponent({
  components: {
    MaterialMenu,
    LoveAction,
    Editor,
    MaterialButton
  },
  props: {
    content: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    commentid: {
      type: String,
      required: true
    },
    threadid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { uid, isAuthz } = useAuthz()
    const { isAdmin } = useMeta()
    const { deleteComment } = useDiscussion(props.threadid)
    const editReply = ref(false)
    const replyContent = ref(props.content)

    const { discussion } = useDiscussion(props.threadid)
    const reply = computed(() => discussion.value.find((r) => (r.replyid === props.commentid)))

    const replyClasses = ref({
      fromMe: uid.value === props.author
    })
    watch(uid, (val) => {
      replyClasses.value.fromMe = val === props.author
    })

    const dropComment = () => {
      deleteComment(props.commentid)
    }

    const editComment = () => {
      editReply.value = true
    }

    const loves = computed(() => {
      if (!reply.value) return false
      if (!reply.value.lovers) return false
      return reply.value.lovers.includes(uid.value)
    })

    const toggleLove = () => {
      if (!isAuthz) return
      if (loves.value) unloveReply(uid.value, props.threadid, props.commentid)
      else loveReply(uid.value, props.threadid, props.commentid)
    }

    const menu = computed(() => {
      const arr = new Array<MenuItem>()
      if (uid.value === props.author) {
        arr.push({ action: dropComment, text: 'Delete!' })
        arr.push({ action: editComment, text: 'Edit' })
      } else if (isAdmin(uid.value)) {
        arr.push({ action: dropComment, text: 'Delete!', admin: true })
      }
      return arr
    })

    const updateReply = () => {
      editReply.value = false
      updateReplyContent(uid.value, props.threadid, props.commentid, replyContent.value)
    }

    return { menu, replyClasses, reply, uid, loves, toggleLove, editReply, replyContent, updateReply }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass
@import @/styles/material-colors.sass

.replyComment
  @include TypeBody2()
  position: relative
  background-color: $color-base-darker
  margin: 8px
  padding: 8px
  border-radius: 4px
  // for triangle
  margin-left: 24px
  color: $color-font-medium
  &.fromMe
    margin-left: 8px
    margin-right: 24px
    background-color: white
    padding: 7px
    border: solid 1px $color-base-darker

.author
  color: $color-fill-primary-dark
.fromMe .author
  color: $color-fill-primary-light

.replyComment:after
  content: ""
  position: absolute
  border-style: solid
  border-color: transparent $color-base-darker

.replyComment:not(.fromMe):after
  top: 8px // controls vertical position
  left: -16px // value = - border-left-width - border-right-width */
  border-width: 8px 16px 8px 0
  bottom: auto

.replyComment.fromMe:after
  top: 8px // controls vertical position
  right: -16px // value = - border-left-width - border-right-width */
  border-width: 8px 0px 8px 16px
  bottom: auto

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
