<template>
  <div class="homeStream">
    <div
      v-for="(entry) in stream"
      :key="entry.key"
    >
      <transition name="fade">
        <div v-if="entry.thread">
          <!-- @todo add new thread card for front page -->
          <ThreadCard :thread="entry.thread" />
        </div>
        <div v-else-if="entry.feedPost">
          <!-- @todo add new thread card for front page -->
          <WPCard :feedPost="entry.feedPost" />
        </div>
        <div v-else-if="entry.key === 'welcome'">
          <!-- @todo add new welcome card for front page -->
          <WelcomeCard />
        </div>
        <div v-else-if="entry.key === 'wikiChanges'">
          <!-- @todo add new wikichanges card for front page -->
          <WikiChangesCard />
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { useAuthState } from '@/state/authz'
import { usePagelog } from '@/state/pagelog'
import { Thread, useThreads } from '@/state/threads'
import { computed, defineComponent } from 'vue'
import ThreadCard from './ThreadCard.vue'
import WelcomeCard from './WelcomeCard.vue'
import WikiChangesCard from './WikiChangesCard.vue'
import { useLoki } from '@/state/feeds'
import { FeedPost } from '@/state/feeds/loki'
import { DateTime } from 'luxon'
import WPCard from './WPCard.vue'

interface StreamEntry {
  key: string
  thread?: Thread,
  feedPost?: FeedPost
}

function merge (first:Array<Thread|FeedPost>, second:Array<Thread|FeedPost>): Array<Thread|FeedPost> {
  const merged = [...first, ...second].sort((a, b) => {
    const as = 'date' in a ? DateTime.fromISO(a.date).toMillis() / 1000 : a.flowTime?.seconds
    const bs = 'date' in b ? DateTime.fromISO(b.date).toMillis() / 1000 : b.flowTime?.seconds
    return (bs || 0) - (as || 0)
  })
  return merged
}

/**
 * The stream component for the front page of the app. Loads stream entities, and injects
 * them to relevant card-components for the purpose
 */
export default defineComponent({
  name: 'HomeStream',
  components: { WelcomeCard, ThreadCard, WikiChangesCard, WPCard },
  setup () {
    const { lastFlowtime } = usePagelog()
    const { isAnonymous } = useAuthState()

    const stream = computed(() => {
      const entries = new Array<StreamEntry>()

      // Show latest 11 threads in order, and inject
      // wikichanges card to a position where latest
      // change timestamp > next thread flowtime (createtime or last comment time,
      // wich ever is greater)
      let wikiChangesInStream: boolean
      const { stream: streamThreads } = useThreads()
      const { feedPosts } = useLoki()
      const clipped = Array.from(feedPosts.value.values())
      if (clipped.length > 5) clipped.length = 5
      const streamItems = merge(clipped, Array.from(streamThreads.value))
      streamItems.forEach((t) => {
        // inject latest wikichanges to relevant position
        // @TODO state handler for wiki latest changes, and
        // insert it here
        // console.log(t.flowTime?.seconds, lastFlowtime.value)
        if (!wikiChangesInStream && ('flowTime' in t && (t.flowTime?.seconds || 0) < lastFlowtime.value)) {
          // console.debug('wikiChanges?')
          entries.push({ key: 'wikiChanges' })
          wikiChangesInStream = true
        } else if ('id' in t) entries.push({ key: t.id, thread: t })
        else if ('ID' in t) entries.push({ key: '' + t.ID, feedPost: t })
      })

      // push to the top of array, if needed
      if (isAnonymous.value) {
        entries.reverse()
        entries.push({ key: 'welcome' })
        entries.reverse()
      }

      return entries
    })
    return { stream }
  }
})
</script>

<style lang="sass" scoped>
div.homeStream
  max-width: 580px
  margin: 0 auto
</style>
