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
import ReplyForm from './reply/ReplyForm.vue'
import Reply from './Reply.vue'
import { Quote } from '@/utils/contentFormat'
import { Thread, Reply as ReplyType } from '@/utils/firestoreInterfaces'

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

    const quote:Ref<Quote> = ref({ content: '', author: '' })
    provide('quotedContent', quote)

    function addQuote (q: Quote) {
      quote.value = q
    }

    let focused = false
    function hasFocus (r: ReplyType) {
      const focusTo = parseInt(props.focusTo)
      if (!focusTo || focused) return false
      if ((r.created?.seconds || 1) > focusTo) focused = true
      if (r.replyid === Array.from(replies.value?.values())?.pop()?.replyid) focused = true
      return focused
    }

    return { replies, addQuote, quote, hasFocus }
  }
})
</script>

<style lang="sass" scoped>
.discussion
  padding-bottom: 1px

</style>
