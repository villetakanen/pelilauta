<template>
  <section class="ThreadListItem">
    <router-link :to="`/thread/${thread.id}/view`">
      <Icon
        headline
        class="topic"
        :name="streamTopic.icon"
      /><h3 class="clipWithEllipsis">
        {{ thread.title }}
      </h3>
      <p class="lowEmphasis">
        {{ snippet }}
      </p>
    </router-link>
    <Toolbar>
      <AuthorTag :uid="thread.author" />
      <SpacerDiv />
      <ThreadLoves
        :thread="thread"
        @refresh="$emit('refresh')"
      />
      <ThreadReplies :thread="thread" />
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
    const snippet = computed(() => {
      const div = document.createElement('div')
      div.innerHTML = props.thread.content
      let snip = ''
      if (div.firstChild) {
        snip = div.firstChild.textContent || ''
        if (snip.length > 53) snip = snip.substring(0, 52) + '...'
      }
      return snip
    })
    return { streamTopic, snippet }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass

section.ThreadListItem
  position: relative
  .topic
    position: absolute
  a
    text-decoration: none
    h3
      @include TypeHeadline6()
      margin-bottom: 0
      white-space: nowrap
    p
      @include TypeBody2()
      font-style: italic
      margin-top: 0
      margin-bottom: 12px
    h3, p
      text-decoration: none
      padding-left: 64px
section.ThreadListItem + section.ThreadListItem
  border-top: solid var(--chroma-secondary-h) 1px
  margin-top: 16px
  padding-top: 8px
</style>
