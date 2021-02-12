<template>
  <div class="discussion">
    <ReplyBubble
      v-for="(reply) in discussion"
      :key="reply.replyid"
      :authorid="reply.author"
      :content="reply.content"
      :commentid="reply.replyid"
      :threadid="thread.id"
      @quote="addQuote"
    />
    <ReplyForm
      :threadid="thread.id"
      :quoted="quote"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, Ref } from 'vue'
import { useDiscussion } from '@/lib/discussion'
import ReplyForm from './ReplyForm.vue'
import { Thread } from '@/state/threads'
import { Quote } from '@/utils/contentFormat'
import ReplyBubble from './ReplyBubble.vue'

export default defineComponent({
  name: 'Discussion',
  components: {
    ReplyForm,
    ReplyBubble
  },
  props: {
    thread: {
      type: Object as PropType<Thread>,
      required: true
    }
  },
  setup (props) {
    const { discussion } = useDiscussion(props.thread.id)

    const quote:Ref<Quote|null> = ref(null)

    function addQuote (q: Quote) {
      quote.value = q
    }

    return { discussion, addQuote, quote }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass

.discussion
  padding-bottom: 1px

</style>
