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
import { Thread, useThreads } from '@/state/threads'
import { computed, defineComponent } from 'vue'
import ThreadCard from '../stream/ThreadCard.vue'
import WelcomeCard from './WelcomeCard.vue'
import WikiChangesCard from './WikiChangesCard.vue'

interface StreamEntry {
  key: string
  thread?: Thread
}

/**
 * The stream component for the front page of the app. Loads stream entities, and injects
 * them to relevant card-components for the purpose
 */
export default defineComponent({
  name: 'HomeStream',
  components: { WelcomeCard, ThreadCard, WikiChangesCard },
  setup () {
    const { isAnonymous } = useAuthState()
    const stream = computed(() => {
      const entries = new Array<StreamEntry>()

      // Show latest 11 threads in order, and inject
      // wikichanges card to a position where latest
      // change timestamp > next thread flowtime (createtime or last comment time,
      // wich ever is greater)
      let wikiChangesInStream: boolean
      const { stream: streamThreads } = useThreads()
      streamThreads.value.forEach((t) => {
        // inject latest wikichanges to relevant position
        // @TODO state handler for wiki latest changes, and
        // insert it here
        if (!wikiChangesInStream && (t.flowTime === null || t.flowTime.seconds > 0)) {
          console.debug('wikiChanges?')
          entries.push({ key: 'wikiChanges' })
          wikiChangesInStream = true
        }
        entries.push({ key: t.id, thread: t })
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
