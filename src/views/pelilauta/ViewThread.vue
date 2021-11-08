<template>
  <div class="viewThread">
    <ThreadHeader :thread="thread" />
    <div class="singleColumnLayout richText">
      <h1 class="hideOnMobile">
        {{ thread.data.title }}
      </h1>
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
        class="threadContent"
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
    </div>
    <teleport to="#ScreenBottomFabsContainer">
      <ToTopFab />
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from 'vue'
import ToTopFab from '@/components/app/ToTopFab.vue'
import Discussion from '@/components/discussion/Discussion.vue'
import PhotoBox from '@/components/stream/PhotoBox.vue'
import { useThreads } from '@/state/threads/threads'
import ThreadBoxTailer from '@/components/thread/ThreadBoxTailer.vue'
import { getAnalytics, logEvent } from '@firebase/analytics'
import ThreadHeader from '@/components/thread/ThreadHeader.vue'

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
    PhotoBox,
    Discussion,
    ToTopFab,
    ThreadBoxTailer,
    ThreadHeader
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
      watch(() => props.threadid, (threadid) => {
        subscribeThread(threadid)
      }, { immediate: true })

      logEvent(getAnalytics(),
        'ThreadView', {
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
    border-top: solid 1px var(--color-b-h)
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
