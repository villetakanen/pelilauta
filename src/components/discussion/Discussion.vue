<template>
  <div class="discussion">
    <Reply
      v-for="(comment) in discussion"
      :key="comment.replyid"
      :author="comment.author"
      :content="comment.content"
      :commentid="comment.replyid"
      :threadid="threadid"
      @quote="addQuote"
    />
    <ReplyForm :threadid="threadid" :quoted="quote" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, computed, ref, Ref } from 'vue'
import { useDiscussion } from '@/lib/discussion'
import ReplyForm from './ReplyForm.vue'
import Reply from './Reply.vue'
import { useAuthz } from '@/lib/authz'
import { useThreads, Thread, fetchThread } from '@/state/threads'

export default defineComponent({
  name: 'Discussion',
  components: {
    ReplyForm,
    Reply
  },
  props: {
    threadid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { discussion } = useDiscussion(props.threadid)
    const { stampSeen, profile } = useAuthz()
    const { stream } = useThreads()
    const thread = computed(() => {
      const t = stream.value.find((val) => (val.id === props.threadid))
      if (t) return t
      fetchThread(props.threadid).then((val) => {
        return val
      })
    })

    function seenThis (t: Thread) {
      console.log('seenThis', t.flowTime, t.id)
      const lastSeen = profile.value.seenThreads.get(props.threadid)
      if (!lastSeen || lastSeen.seconds < t.flowTime.seconds) stampSeen(t.id, t.flowTime)
    }

    onMounted(() => {
      if (thread.value) seenThis(thread.value)
      watch(thread, (t) => {
        if (t) seenThis(t)
      })
    })

    const quote:Ref<Record<string, string>|null> = ref(null)

    function addQuote (q: Record<string, string>) {
      quote.value = q
    }

    return { discussion, addQuote, quote }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass

.discussion
  //background-color: $color-base-darker
  padding-bottom: 1px

</style>
