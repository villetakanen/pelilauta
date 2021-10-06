<template>
  <Column class="homeStream double">
    <transition name="fade">
      <WelcomeCard v-if="anonymousSession" />
    </transition>
    <template
      v-for="(entry) in stream"
      :key="entry.key"
    >
      <transition name="fade">
        <!-- @todo add new thread card for front page -->
        <ThreadCard
          v-if="entry.thread"
          :thread="entry.thread"
        />
        <!-- @todo add new thread card for front page -->
        <WPCard
          v-else-if="entry.feedPost"
          :feed-post="entry.feedPost"
        />
        <!-- @todo add new wikichanges card for front page -->
        <WikiChangesCard v-else-if="entry.key === 'wikiChanges'" />
      </transition>
    </template>
  </Column>
</template>

<script lang="ts">
import { useAuth } from '@/state/authz'
import { usePagelog } from '@/state/pagelog'
import { useThreads } from '@/state/threads'
import { Thread } from '@/utils/firestoreInterfaces'
import { computed, defineComponent } from 'vue'
import ThreadCard from './threadcard/ThreadCard.vue'
import WelcomeCard from './WelcomeCard.vue'
import WikiChangesCard from './WikiChangesCard.vue'
import { useLoki } from '@/state/feeds'
import { FeedPost } from '@/state/feeds/loki'
import { DateTime } from 'luxon'
import WPCard from './LokiCard.vue'
import Column from '../layout/Column.vue'

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
  components: { WelcomeCard, ThreadCard, WikiChangesCard, WPCard, Column },
  setup () {
    const { lastFlowtime } = usePagelog()
    const { anonymousSession } = useAuth()

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
        if (!wikiChangesInStream && ('flowTime' in t && (t.flowTime?.seconds || 0) < lastFlowtime.value)) {
          entries.push({ key: 'wikiChanges' })
          wikiChangesInStream = true
        }
        if ('id' in t) entries.push({ key: t.id, thread: t })
        else if ('ID' in t) entries.push({ key: '' + t.ID, feedPost: t })
      })

      return entries
    })
    return { stream, anonymousSession }
  }
})
</script>

<style lang="sass" scoped>
.homeStream
  padding: 0px
  max-width: 604px
</style>
