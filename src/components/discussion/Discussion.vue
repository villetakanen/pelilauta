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
import { defineComponent, onMounted, ref, PropType, Ref } from 'vue'
import { useDiscussion } from '@/lib/discussion'
import ReplyForm from './ReplyForm.vue'
import Reply from './Reply.vue'
import { useAuthz } from '@/lib/authz'
import { Thread } from '@/state/threads'
import { useProfile } from '@/state/authz'
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
    const { stampSeen } = useAuthz()
    const { profileMeta } = useProfile()

    function seenThis (t: Thread) {
      console.log('seenThis', t.flowTime, t.id)
      const lastSeen = profileMeta.value.seenThreads.get(props.thread.id)
      if (!lastSeen || lastSeen.seconds < t.flowTime.seconds) stampSeen(t.id, t.flowTime)
    }

    onMounted(() => {
      seenThis(props.thread)
    })

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
