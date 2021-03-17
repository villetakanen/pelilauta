<template>
  <div>
    <div style="margin: 0 8px">
      <Toolbar>
        <h3 v-if="stream">
          {{ stream.name }}
        </h3>
      </Toolbar>
    </div>
    <div class="twoColFlexSection">
      <PinnedStream class="col" />
      <ThreadList
        :topic="routeTopic"
        class="col"
      />
    </div>
    <teleport to="#ScreenBottomFloatRight">
      <Fab
        v-if="!isAnonymous && stream"
        :to="`/stream/topic/${stream.slug}/post`"
        :text="$t('action.addThread')"
      >
        <img
          src="@/assets/icons/add.svg"
          alt="new post"
        >
      </Fab>
    </teleport>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import ThreadList from '@/components/stream/ThreadList.vue'
import Fab from '@/components/material/Fab.vue'
import { useMeta } from '@/state/meta'
import { useRoute } from 'vue-router'
import { useAuthState } from '@/state/authz'
import Toolbar from '@/components/layout/Toolbar.vue'
import PinnedStream from '@/components/topic/PinnedStream.vue'
import { useThreads } from '@/state/threads'

export default defineComponent({
  name: 'StreamTopic',
  components: {
    ThreadList,
    Fab,
    Toolbar,
    PinnedStream
  },
  props: {
    topic: {
      type: String,
      required: true
    }
  },
  setup (props) {
    // Subscibe/Fetch required threads to the state
    useThreads(props.topic.charAt(0).toUpperCase() + props.topic.slice(1))

    // @TODO please review the code below, it looks very sketchy
    const { streams } = useMeta()

    const route = useRoute()
    const routeTopic = computed(() => {
      return Array.isArray(route.params.topic) ? route.params.topic[0] : route.params.topic
    })

    const stream = computed(() => {
      return streams.value.find((val) => (val.slug.toLowerCase() === routeTopic.value.toLowerCase()))
    })

    const showEditorDialog = ref(false)

    const newThread = () => {
      showEditorDialog.value = true
    }

    const { isAnonymous } = useAuthState()

    return { stream, routeTopic, newThread, showEditorDialog, isAnonymous }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss

@include media('>tablet')
  .twoColFlexSection
    max-width: 1024px
    margin: 0 auto
    display: flex
    flex-direction: row-reverse
    .col
      width: calc( 50% - 16px )
      margin: 0 8px

</style>
