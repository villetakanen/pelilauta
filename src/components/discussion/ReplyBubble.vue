<template>
  <div
    :class="{fromMe: fromMe}"
    class="discussionReplyBubble"
  >
    <div class="toolbar">
      <div class="author">
        <template v-if="!authorid">
          {{ authorNick }}
        </template>
        <router-link
          v-else
          :to="`/author/${authoruid}`"
        >
          {{ authorNick }}
        </router-link>
      </div>
      <div class="spacer" />
      <LoveAReplyAction style="margin-right: 8px" />
      <MaterialMenu
        v-model="menu"
        small
      />
    </div>
    <div :innerHTML="content" />
  </div>
</template>

<script lang="ts">
import { useAuthors } from '@/lib/authors'
import { useDiscussion } from '@/lib/discussion'
import { MenuItem } from '@/lib/meta'
import { useAuthState } from '@/state/authz'
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import MaterialMenu from '../material/MaterialMenu.vue'
import LoveAReplyAction from './LoveAReplyAction.vue'

export default defineComponent({
  components: { LoveAReplyAction, MaterialMenu },
  props: {
    content: {
      type: String,
      required: true
    },
    authorid: {
      type: String,
      required: false,
      default: ''
    },
    threadid: {
      type: String,
      required: false,
      default: ''
    },
    fromMe: {
      type: Boolean,
      required: false,
      default: false
    },
    replyid: {
      type: String,
      required: true
    }
  },
  emits: ['quote'],
  setup (props, context) {
    const { deleteComment } = useDiscussion(props.threadid)
    const { uid, isAdmin } = useAuthState()

    const quoteComment = () => {
      context.emit('quote', { content: props.content, author: authorNick.value })
    }

    const dropComment = async () => {
      return deleteComment(props.replyid)
    }

    const i18n = useI18n()

    const menu = computed(() => {
      const arr = new Array<MenuItem>()
      arr.push({ action: quoteComment, text: i18n.t('action.quote') })
      if (uid.value === props.authorid) {
        arr.push({ action: dropComment, text: 'Delete!' })
        // arr.push({ action: editComment, text: 'Edit' })
      } else if (isAdmin.value) {
        arr.push({ action: dropComment, text: 'Delete!', admin: true })
      }
      return arr
    })

    const { authors } = useAuthors()
    const authorNick = computed(() => (authors.value.find((a) => (a.uid === props.authorid))?.nick || 'α'))

    return { menu, authorNick }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass
@import @/styles/material-colors.sass
@import @/styles/layout.sass

.discussionReplyBubble
  @include TypeBody2()
  @include DontBreakOut()
  position: relative
  background-color: rgba($color-fill-primary-dark, 0.22)
  margin: 8px
  margin-left: 24px // Triangle for bubble!
  padding: 16px
  border-radius: 0 6px 6px 6px
  color: $color-font-high
  &.fromMe
    margin-left: 8px
    margin-right: 24px
    background-color: rgba($color-fill-primary, 0.22)
    border-radius: 8px 0px 8px 8px
  .author
    font-weight: 500
    color: $color-fill-primary-dark

.discussionReplyBubble:not(.fromMe):after
  content: ""
  position: absolute
  border-style: solid
  border-color: transparent rgba($color-fill-primary-dark, 0.22)
  top: 0px // controls vertical position
  left: -16px // value = - border-left-width - border-right-width */
  border-width: 0px 16px 16px 0
  bottom: auto

.discussionReplyBubble.fromMe:after
  content: ""
  position: absolute
  border-style: solid
  top: 0px // controls vertical position
  right: -16px // value = - border-left-width - border-right-width */
  border-width: 0px 0px 16px 16px
  border-color: transparent rgba($color-fill-primary, 0.22)
  bottom: auto

</style>
