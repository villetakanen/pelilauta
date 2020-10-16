<template>
  <div
    :class="replyClasses"
    class="replyComment"
  >
    <div class="reply-header toolbar">
      <div class="author">
        {{ nick }}
      </div>
      <div class="spacer" />
      <MaterialMenu
        v-model="menu"
        small
        style="float: right"
      />
    </div>
    <div
      class="message"
    >
      <div
        :innerHTML="content"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import { useAuthz } from '@/lib/authz'
import MaterialMenu from '@/components/material/MaterialMenu.vue'
import { useMeta } from '@/lib/meta'
import { MenuItem } from '@/lib/stream'
import { useDiscussion } from '@/lib/discussion'

export default defineComponent({
  components: {
    MaterialMenu
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
    postid: {
      type: String,
      required: true
    },
    nick: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { uid } = useAuthz()
    const { isAdmin } = useMeta()
    const { deleteComment } = useDiscussion(props.postid)

    const replyClasses = ref({
      fromMe: uid.value === props.author
    })
    watch(uid, (val) => {
      replyClasses.value.fromMe = val === props.author
    })

    const dropComment = () => {
      deleteComment(props.commentid)
    }

    const menu = computed(() => {
      const arr = new Array<MenuItem>()
      if (isAdmin(uid.value) || uid.value === props.author) {
        arr.push({ action: dropComment, text: 'Delete!' })
      }
      return arr
    })

    return { menu, replyClasses }
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
  &.fromMe
    margin-left: 8px
    margin-right: 24px
    background: none
    padding: 7px
    border: solid 1px $color-base-darker

.author
  color: $color-primary-dark
.fromMe .author
  color: $color-primary-light

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
      color: $color-primary-light
      flex-grow: 0

</style>
