<template>
  <div class="discussion">
    <Reply
      v-for="(comment) in discussion"
      :key="comment.replyid"
      :author="comment.author"
      :content="comment.content"
      :commentid="comment.replyid"
      :nick="comment.nick"
      :postid="postid"
    />
    <ReplyForm :postid="postid" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useDiscussion } from '@/lib/discussion'
import ReplyForm from './ReplyForm.vue'
import Reply from './Reply.vue'

export default defineComponent({
  name: 'Discussion',
  components: {
    ReplyForm,
    Reply
  },
  props: {
    postid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { discussion } = useDiscussion(props.postid)
    return { discussion }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass

.discussion
  //background-color: $color-base-darker
  padding-bottom: 1px

</style>
