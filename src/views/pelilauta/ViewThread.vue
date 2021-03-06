<template>
  <div class="viewThread singleColumnLayout">
    <ThreadBox>
      <ThreadBoxHeader :thread="thread" />
      <div
        v-if="thread.data.youTubeSlug"
        class="youtubePreviewFrame"
      >
        <iframe
          title="Youtube Preview"
          class="youtubePreview"
          :src="`https://www.youtube.com/embed/${thread.data.youTubeSlug}?enablejsapi=1&origin=http://example.com`"
          frameborder="0"
        />
      </div>
      <div
        class="threadContent richText"
        :innerHTML="thread.data.content"
      />
      <PhotoBox :photos="thread.data.images || []" />
      <ThreadBoxTailer
        :thread="thread"
      />
      <h2 class="section">
        {{ $t('threads.discussion') }}
      </h2>
      <Discussion
        :thread="thread"
        :focus-to="since"
      />
    </ThreadBox>
    <teleport to="#ScreenBottomFabsContainer">
      <ToTopFab />
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import ToTopFab from '@/components/app/ToTopFab.vue'
import Discussion from '@/components/discussion/Discussion.vue'
import PhotoBox from '@/components/stream/PhotoBox.vue'
import ThreadBox from '@/components/thread/ThreadBox.vue'
import ThreadBoxHeader from '@/components/thread/ThreadBoxHeader.vue'
import { useThreads } from '@/state/threads/threads'
import firebase from 'firebase/app'
import 'firebase/analytics'
import ThreadBoxTailer from '@/components/thread/ThreadBoxTailer.vue'

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
    ToTopFab,
    ThreadBoxTailer
  },
  props: {
    threadid: {
      type: String,
      required: true
    },
    since: {
      type: String,
      required: false,
      default: '0'
    }
  },
  setup (props) {
    const { thread, subscribeThread } = useThreads()
    subscribeThread(props.threadid)
    onMounted(() => {
      firebase.analytics().logEvent('PageView', {
        name: 'ViewThread',
        threadid: props.threadid
      })
    })
    return { thread }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-typography.sass

.viewThread
  div.threadContent
    p
      @include TypeBody2()
  h2.section
    @include TypeHeadline5()
    border-top: solid 1px var(--chroma-primary-g)
    padding-top: 7px
    padding-bottom: 8px
  .youtubePreviewFrame
    width: 100%
    text-align: center
    padding: 8px
    background-color: rgba(var(--chroma-primary-c-rgba), 0.22)
    line-height: 0
    .youtubePreview
      margin: 0 auto
      padding: 0
      height: 186px
      width: 320px

</style>
