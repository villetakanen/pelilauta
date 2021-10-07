<template>
  <Card
    class="pinnedThreadCard"
    :rise="0"
  >
    <h1 class="cardTitle">
      <router-link :to="`/thread/${thread.id}/view/`">
        {{ thread.data.title }}
      </router-link>
    </h1>
    <p
      class="contentSnippet onlyForDesktop TypeBody2"
    >
      {{ snippet }}
    </p>
    <transition name="fade">
      <div>
        <p
          class="topic"
        >
          <router-link :to="`/thread/${thread.id}/view`">
            {{ thread ? thread.replyCount + ' ' + $t('post.nOfReplies') : $t('post.more') }}
          </router-link>
        </p>
      </div>
    </transition>
  </Card>
</template>

<script lang="ts">
import { Thread } from '@/utils/firestoreInterfaces'
import { computed, defineComponent, PropType } from 'vue'
import Card from '../layout/Card.vue'

export default defineComponent({
  components: { Card },
  props: {
    thread: {
      type: Object as PropType<Thread>,
      required: true
    }
  },
  setup (props) {
    const snippet = computed(() => {
      const div = document.createElement('div')
      div.innerHTML = props.thread.data.content
      let snip = ''
      if (div.firstChild) {
        snip = div.firstChild.textContent || ''
        if (snip.length > 172) snip = snip.substring(0, 172) + '...'
      }
      return snip
    })
    return { snippet }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-typography.sass

.pinnedThreadCard
  border-radius: 0
  background: linear-gradient(-37deg, var(--chroma-secondary-c) 0%, var(--chroma-secondary-d) 100%)
  h1.cardTitle
    @include TypeHeadline6()
    padding-top: 0
    margin-top: 0
    line-height: 24px
    a
      color: var(--chroma-secondary-i)
  .contentSnippet
    @include TypeBody2()
    margin-top: 8px
    margin-bottom: 8px
    color: var(--chroma-secondary-h)
  .topic
    text-align: right
    @include TypeBody2()
    a
      color: var(--chroma-secondary-g)
      text-decoration: none
</style>
