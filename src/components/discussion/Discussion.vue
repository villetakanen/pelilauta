<template>
  <div class="discussion">
    <Reply
      v-for="(reply) in replies"
      :key="reply[0]"
      :threadid="thread.id"
      :reply="reply[1]"
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

    return { replies, addQuote, quote }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass

.discussion
  padding-bottom: 1px

</style>
