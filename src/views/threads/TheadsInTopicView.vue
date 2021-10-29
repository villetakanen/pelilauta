<template>
  <div>
    <TopicToolbar
      :icon="stream.icon"
      :channel="stream.name"
    />
    <div class="bookLayout">
      <ThreadList
        :topic="routeTopic"
      />
      <PinnedStream />
    </div>
    <teleport to="#ScreenBottomFabsContainer">
      <ToTopFab style="margin-right:8px" />
      <Fab
        v-if="showMemberTools && stream"
        :to="`/stream/topic/${stream.slug}/post`"
        :text="$t('action.addThread')"
        icon="addDiscussion"
      />
    </teleport>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue'
import ThreadList from '@/components/stream/ThreadList.vue'
import Fab from '@/components/material/Fab.vue'
import { useMeta } from '@/state/meta'
import { useRoute } from 'vue-router'
import { useAuth } from '@/state/authz'
import PinnedStream from '@/components/topic/PinnedStream.vue'
import { useThreads } from '@/state/threads'
import ToTopFab from '@/components/app/ToTopFab.vue'
import TopicToolbar from '@/components/topic/TopicToolbar.vue'

export default defineComponent({
  name: 'StreamTopic',
  components: {
    ThreadList,
    Fab,
    PinnedStream,
    ToTopFab,
    TopicToolbar
  },
  props: {
    topic: {
      type: String,
      required: true
    }
  },
  setup (props) {
    // Subscibe/Fetch required threads to the state
    watch(() => props.topic, (topicProp) => {
      useThreads(topicProp.charAt(0).toUpperCase() + topicProp.slice(1))
    }, { immediate: true })

    // @TODO please review the code below, it looks very sketchy
    const { streams } = useMeta()

    const route = useRoute()
    const routeTopic = computed(() => {
      return Array.isArray(route.params.topic) ? route.params.topic[0] : route.params.topic
    })

    const stream = computed(() => {
      return streams.value.find((val) => (val.slug.toLowerCase() === routeTopic.value.toLowerCase())) || { name: '', icon: '' }
    })

    const { showMemberTools } = useAuth()

    return { stream, routeTopic, showMemberTools }
  }
})
</script>
