<template>
  <div class="homeStream">
    <div
      v-for="(entry) in stream"
      :key="entry.key"
    >
      <div v-if="entry.thread">
        <!-- @todo add new thread card for front page -->
        {{ entry.thread }}
      </div>
      <div v-else-if="entry.key === 'welcome'">
        <!-- @todo add new welcome card for front page -->
        Welcome card
      </div>
      <div v-else-if="entry.key === 'wikiChanges'">
        <!-- @todo add new wikichanges card for front page -->
        wikiChanges -card
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useAuthState } from '@/state/authz'
import { Thread, useThreads } from '@/state/threads'
import { computed, defineComponent } from 'vue'

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
        if (!wikiChangesInStream && t.flowTime?.seconds < 0) {
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
