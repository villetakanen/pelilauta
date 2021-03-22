<template>
  <div class="siteThreadList">
    <h3>{{ $t('site.threads.title') }}</h3>
    <ul>
      <ThreadListItem
        v-for="thread in siteThreads"
        :key="thread"
        :thread="thread"
      />
    </ul>
  </div>
</template>

<script lang="ts">
import ThreadListItem from '@/components/thread/ThreadListItem.vue'
import { useThreads, fetchSite } from '@/state/threads'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SiteThreadList',
  components: {
    ThreadListItem
  },
  props: {
    siteid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    fetchSite(props.siteid)
    const { siteThreads } = useThreads()
    return { siteThreads }
  }
})
</script>
