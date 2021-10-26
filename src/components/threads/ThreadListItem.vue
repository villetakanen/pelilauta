<template>
  <section class="ThreadListItem">
    <h3>
      <router-link :to="`/thread/${thread.id}/view`">
        <Icon
          inline
          :name="streamTopic.icon"
        />{{ thread.title }}
      </router-link>
    </h3>
    <Toolbar>
      <ThreadLoves
        :thread="thread"
        @refresh="$emit('refresh')"
      />
      <ThreadReplies :thread="thread" />
      <SpacerDiv />
      <AuthorTag :uid="thread.author" />
    </Toolbar>
  </section>
</template>

<script lang="ts">
import { useMeta } from '@/state/meta'
import { ThreadClass } from '@/state/threads/threads'
import { computed, defineComponent } from 'vue'
import AuthorTag from '../author/AuthorTag.vue'
import SpacerDiv from '../layout/SpacerDiv.vue'
import Toolbar from '../layout/Toolbar.vue'
import Icon from '../material/Icon.vue'
import ThreadLoves from '../thread/ThreadLoves.vue'
import ThreadReplies from '../thread/ThreadReplies.vue'

export default defineComponent({
  name: 'ThreadListItem',
  components: { Icon, Toolbar, AuthorTag, SpacerDiv, ThreadLoves, ThreadReplies },
  props: {
    thread: {
      type: ThreadClass,
      required: true
    }
  },
  emits: ['refresh'],
  setup (props) {
    const { streams } = useMeta()
    const streamTopic = computed(() => (
      streams.value.find((s) => (s.slug === props.thread?.topic)) || { icon: 'pelilauta' }
    ))
    return { streamTopic }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass

section.ThreadListItem
  h3
    @include TypeBody1()

section.ThreadListItem + section.ThreadListItem
  border-top: solid var(--chroma-secondary-g) 1px
</style>
