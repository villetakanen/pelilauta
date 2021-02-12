<template>
  <div class="discussion">
    <Reply
      v-for="(comment) in discussion"
      :key="comment.replyid"
      :author="comment.author"
      :content="comment.content"
      :commentid="comment.replyid"
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
