<template>
  <div class="threadBoxHeader">
    <h1>{{ thread.data.title }}</h1>
    <p class="caption">
      {{ toDisplayString(thread.created) }}
      {{ $t('threads.sinceInTopic') }}
      <router-link :to="`/stream/topic/${thread.data.topic}`">
        {{ topicName }}
      </router-link>
    </p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { Thread } from '@/state/threads'
import { useMeta } from '@/state/meta'
import { toDisplayString } from '@/utils/firebaseTools'

export default defineComponent({
  name: 'ThreadBoxHeader',
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
    return { topicName, toDisplayString }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-typography.sass

.threadBoxHeader
  background-color: var(--color-fill-primary)
  height: 48px
  margin: 0
  margin-bottom: 8px
  h1
    @include TypeHeadline5()
  p.caption
    @include TypeCaption()

@include media('<tablet')
  .threadBoxHeader
</style>
