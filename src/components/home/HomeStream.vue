<template>
  <Column class="homeStream double-cut">
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
        <MekanismiCard v-else-if="entry.key === 'wikiChanges'" />
      </transition>
    </template>
    <hr>
    <Toolbar>
      <SpacerDiv />
      <Button
        text
        @click="$router.push('/threads')"
      >
        <Icon
          small
          name="discussion"
        />
        {{ $t('home.morePostsInTheForums') }}
      </Button>
      <SpacerDiv />
    </Toolbar>
  </Column>
</template>

<script lang="ts">
import { useAuth } from '@/state/authz'
import { usePagelog } from '@/state/pagelog'
import { useThreads } from '@/state/threads'
import { Thread } from '@/utils/firestoreInterfaces'
import { computed, defineComponent, onMounted, ref, Ref } from 'vue'
import ThreadCard from './threadcard/ThreadCard.vue'
import { DateTime } from 'luxon'
import WPCard from './LokiCard.vue'
import Column from '../layout/Column.vue'
import MekanismiCard from './mekanismi/MekanismiCard.vue'
import Toolbar from '../layout/Toolbar.vue'
import SpacerDiv from '../layout/SpacerDiv.vue'
import { WordpressArticle, WordPressSubscription } from '@/utils/wordpress'
import Icon from '../material/Icon.vue'
import Button from '../form/Button.vue'
import { useSites } from '@/state/sites'

interface StreamEntry {
  key: string
  thread?: Thread,
  feedPost?: WordpressArticle
}

function merge (first:Array<Thread|WordpressArticle>, second:Array<Thread|WordpressArticle>): Array<Thread|WordpressArticle> {
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
  components: { ThreadCard, WPCard, Column, MekanismiCard, Toolbar, SpacerDiv, Icon, Button },
  setup () {
    const { visibleSites } = useSites()
    const lastFlowtime = computed(() => [...visibleSites.value].sort((a, b) => b.compareChangeTime(a))[0].updatedAt?.seconds || 0)
    const { anonymousSession } = useAuth()
    const lokiArticles:Ref<WordpressArticle[]> = ref([])
    // const tiedotusArticles:Ref<WordpressArticle[]> = ref([])

    onMounted(async () => {
      const lokiSubscription = new WordPressSubscription('https://public-api.wordpress.com/rest/v1.1/sites/roolipeliloki.wordpress.com/posts')
      lokiArticles.value = await lokiSubscription.subscribe()
      /* const tiedotusSubscription = new WordPressSubscription('https://roolipelitiedotus.fi/wp-json/wp/v2/posts')
      tiedotusArticles.value = await tiedotusSubscription.subscribe() */
    })

    const stream = computed(() => {
      const entries = new Array<StreamEntry>()

      // Show latest 11 threads in order, and inject
      // wikichanges card to a position where latest
      // change timestamp > next thread flowtime (createtime or last comment time,
      // wich ever is greater)
      let wikiChangesInStream: boolean
      const { stream: streamThreads } = useThreads()
      const clipped = Array.from(lokiArticles.value.values())
      if (clipped.length > 3) clipped.length = 3
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
