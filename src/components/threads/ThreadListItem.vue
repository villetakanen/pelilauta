<template>
  <section class="ThreadListItem">
    <h3>
      <Icon
        headline
        :name="streamTopic.icon"
      />{{ title }}
    </h3>
  </section>
</template>

<script lang="ts">
import { useMeta } from '@/state/meta'
import { computed, defineComponent } from 'vue'
import Icon from '../material/Icon.vue'

export default defineComponent({
  name: 'ThreadListItem',
  components: { Icon },
  props: {
    title: {
      type: String,
      required: true
    },
    topic: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { streams } = useMeta()
    const streamTopic = computed(() => (
      streams.value.find((s) => (s.slug === props.topic)) || { icon: 'pelilauta' }
    ))
    return { streamTopic }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass

section.ThreadListItem
  h3
    @include TypeHeadline6()

section.ThreadListItem + section.ThreadListItem
  border-top: dashed var(--chroma-alert) 1px
</style>
