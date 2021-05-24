<template>
  <div>
    <Toolbar>
      <h3 v-if="stream">
        {{ stream.name }}
      </h3>
    </Toolbar>
    <div class="twoColFlexSection">
      <PinnedStream class="col" />
      <ThreadList
        :topic="routeTopic"
        class="col"
      />
    </div>
    <teleport to="#ScreenBottomFloatRight">
      <ToTopFab style="margin-right:8px" />
      <Fab
        v-if="!isAnonymous && stream"
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
import { useAuthState } from '@/state/authz'
import Toolbar from '@/components/layout/Toolbar.vue'
import PinnedStream from '@/components/topic/PinnedStream.vue'
import { useThreads } from '@/state/threads'
import ToTopFab from '@/components/app/ToTopFab.vue'

export default defineComponent({
  name: 'StreamTopic',
  components: {
    ThreadList,
    Fab,
    Toolbar,
    PinnedStream,
    ToTopFab
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
      return streams.value.find((val) => (val.slug.toLowerCase() === routeTopic.value.toLowerCase()))
    })

    const { isAnonymous } = useAuthState()

    return { stream, routeTopic, isAnonymous }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss

.twoColFlexSection
  padding: 0 8px

@include media('>tablet')
  .twoColFlexSection
    max-width: 1024px
    margin: 0 auto
    display: flex
    flex-direction: row-reverse
    .col
      width: 50%
      margin: 0

</style>
