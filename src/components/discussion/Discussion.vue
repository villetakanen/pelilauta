<template>
  <div class="discussion">
    <Reply
      v-for="(reply) in replies"
      :key="reply[0]"
      :threadid="thread.id"
      :reply="reply[1]"
      :focus="hasFocus(reply[1])"
      @quote="addQuote"
    />
    <ReplyForm
      :threadid="thread.id"
      :quoted="quote"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, Ref, provide } from 'vue'
import { subscribeToReplies, useReplies } from '@/state/discussion'
import ReplyForm from './ReplyForm.vue'
import Reply from './Reply.vue'
import { Thread } from '@/state/threads'
import { Quote } from '@/utils/contentFormat'
import { Reply as ReplyType } from '@/utils/firestoreInterfaces'

export default defineComponent({
  name: 'Discussion',
  components: {
    ReplyForm,
    Reply
  },
  props: {
    thread: {
      type: Object as PropType<Thread>,
      required: true
    },
    focusTo: {
      type: String,
      default: '0'
    }
  },
  setup (props) {
    subscribeToReplies(props.thread.id)
    const { replies } = useReplies()
    console.log(replies)

    const quote:Ref<Quote> = ref({ content: '', author: '' })
    provide('quotedContent', quote)

    function addQuote (q: Quote) {
      console.debug('addQuote', q)
      quote.value = q
    }

    let focused = false
    function hasFocus (r: ReplyType) {
      const focusTo = parseInt(props.focusTo)
      console.debug('hasFocus', r.created?.seconds, focusTo, typeof props.focusTo)
      if (!focusTo || focused) return false
      if ((r.created?.seconds || 1) > focusTo) focused = true
      if (r.replyid === Array.from(replies.value?.values())?.pop()?.replyid) focused = true
      console.debug('returns', focused)
      return focused
    }

    return { replies, addQuote, quote, hasFocus }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass

.discussion
  padding-bottom: 1px

</style>
