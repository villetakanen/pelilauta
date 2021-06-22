<template>
  <div
    class="threadCardTailer toolbar"
    :class="{
      withSite: thread.site
    }"
  >
    <div style="min-width: 64px">
      ...
    </div>
    <div class="topicLink spacer">
      {{ $t('stream.inStream') }} <router-link :to="`/stream/topic/${thread.data.topic}`">
        {{ topicName }}
      </router-link>
    </div>
    <RepliesCardToolbarLink :thread="thread" />
  </div>
</template>

<script lang="ts">
import { useMeta } from '@/state/meta'
import { Thread } from '@/utils/firestoreInterfaces'
import { computed, defineComponent, PropType } from 'vue'
import RepliesCardToolbarLink from './RepliesCardToolbarLink.vue'

export default defineComponent({
  components: { RepliesCardToolbarLink },
  props: {
    thread: {
      type: Object as PropType<Thread>,
      required: true
    }
  },
  setup (props) {
    const { streams } = useMeta()
    const topicName = computed(() => {
      return streams.value.find((val) => (val.slug === props.thread.data.topic))?.name
    })
    return { topicName }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass

.topicLink
  @include TypeCaption()
  margin: 0px 8px
  a
    color: var(--chroma-primary-d)
    text-decoration: none

.withSite
  background-color: #{'rgba(var(--chroma-primary-c-rgba), 0.11)'}
  margin-bottom: -16px
  padding-bottom: 8px
  padding-bottom: 8px
  margin-left: -16px
  padding-left: 16px
  margin-right: -16px
  padding-right: 16px
  margin-top: 8px
  border-radius: 0 0 12px 12px
</style>
