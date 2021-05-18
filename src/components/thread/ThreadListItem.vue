<template>
  <li class="threadListItem">
    <router-link :to="`/thread/${thread.id}/view`">
      {{ thread.data.title }}
    </router-link>
    <p class="threadInfo">
      {{ toDisplayString(thread.flowTime) }} – {{ author }}
      <span v-if="topic">– <router-link :to="`/stream/topic/${topic.slug}`">{{ topic.name }}</router-link></span>
    </p>
  </li>
</template>

<script lang="ts">
import { Thread } from '@/utils/firestoreInterfaces'
import { computed, defineComponent, PropType } from 'vue'
import { toDisplayString } from '@/utils/firebaseTools'
import { useAuthors } from '@/state/authors'
import { useMeta } from '@/state/meta'

export default defineComponent({
  name: 'ThreadListItem',
  components: {
  },
  props: {
    thread: {
      type: Object as PropType<Thread>,
      required: true
    }
  },
  setup (props) {
    const { authors } = useAuthors()
    const author = computed(() => (authors.value.find((a) => (a.uid === props.thread.author))?.nick))
    const { streams } = useMeta()
    const topic = computed(() => (streams.value.find((t) => (t.slug === props.thread.data.topic))))
    return { author, topic, toDisplayString }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass

.threadListItem
  a
    text-decoration: none
    color: var(--chroma-secondary-c)
  .threadInfo
    @include TypeCaption()
    line-height: 16px
    margin-bottom: 8px
    color: var(--chroma-secondary-f)

</style>
