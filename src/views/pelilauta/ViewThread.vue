<template>
  <div class="viewThread contentGrid">
    <ThreadBox>
      <ThreadBoxHeader :thread="thread" />
      <div
        class="threadContent"
        :innerHTML="thread.data.content"
      />
      <PhotoBox :photos="thread.data.images || []" />
      <div style="text-align:right">
        <AuthorLink :uid="thread.author" />
      </div>
      <h2 class="section">
        {{ $t('threads.discussion') }}
      </h2>
      <Discussion :thread="thread" />
    </ThreadBox>
    <FloatingReplyActions />
  </div>
</template>

<script lang="ts">
import AuthorLink from '@/components/author/AuthorLink.vue'
import Discussion from '@/components/discussion/Discussion.vue'
import FloatingReplyActions from '@/components/discussion/FloatingReplyActions.vue'
import PhotoBox from '@/components/stream/PhotoBox.vue'
import ThreadBox from '@/components/thread/ThreadBox.vue'
import ThreadBoxHeader from '@/components/thread/ThreadBoxHeader.vue'
import { subscribeThread, useThreads } from '@/state/threads/threads'
import { defineComponent } from 'vue'

/**
 * A Router view for a Stream Thread.
 *
 * Loads all the required State entities, and initiates the required Firebase
 * subscriptions.
 * Does not contain any functionality aside from state management and component
 * import/layout
 */
export default defineComponent({
  name: 'ViewThread',
  components: {
    ThreadBox,
    PhotoBox,
    ThreadBoxHeader,
    Discussion,
    AuthorLink,
    FloatingReplyActions
  },
  props: {
    threadid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    subscribeThread(props.threadid)
    const { thread } = useThreads()
    return { thread }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.viewThread
  position: relative
  margin: 0 auto
  padding: 0
  div.threadContent
    p
      @include TypeBody2()
  h2.section
    @include TypeHeadline5()
    border-top: solid 1px var(--chroma-primary-g)
    padding-top: 7px
    padding-bottom: 8px

</style>
