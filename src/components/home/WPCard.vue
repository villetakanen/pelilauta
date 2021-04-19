<template>
  <Card class="wpCard">
    <img
      class="logo"
      src="@/assets/icons/loki-logo.svg"
      alt="Loki"
    >
    <h1>
      <a
        :href="feedPost.URL"
        target="_blank"
      >{{ feedPost.title }}</a>
    </h1>
    <p class="excrept">
      <a
        :href="feedPost.URL"
        target="new"
      >{{ excerpt }}</a>
    </p>
    <div class="toolbar">
      <p class="info">
        {{ toDisplayString(feedPost.date) }}
      </p>
      <div class="spacer" />
      <p class="info">
        <a
          :href="feedPost.URL"
          target="_blank"
        >{{ $t('home.wpcard.openLink') }} <strong>Loki</strong></a>
      </p>
    </div>
  </Card>
</template>

<script lang="ts">
import { useAuthState } from '@/state/authz'
import { FeedPost } from '@/state/feeds/loki'
import { toDisplayString } from '@/utils/firebaseTools'
import { computed, defineComponent, PropType } from 'vue'
import Card from '../layout/Card.vue'

/**
 * A simple WP card for syndication
 */
export default defineComponent({
  name: 'WPCard',
  components: { Card },
  props: {
    feedPost: {
      type: Object as PropType<FeedPost>,
      required: true
    }
  },
  setup (props) {
    const { isAnonymous } = useAuthState()
    const excerpt = computed(() => {
      const div = document.createElement('div')
      div.innerHTML = props.feedPost.excerpt
      let snip = ''
      if (div.firstChild) {
        snip = div.firstChild.textContent || ''
        if (snip.length > 220) snip = snip.substring(0, 220) + '...'
      }
      return snip
    })
    return { isAnonymous, excerpt, toDisplayString }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass
div.wpCard
  color: var(--chroma-secondary-a)
  margin: 0
  margin-bottom: 8px
  min-height: 72px
  h1
    @include TypeCardHeadline()
    color: var(--chroma-secondary-a)
    margin-top: 0
    padding-top: 0
    a
      color: var(--chroma-secondary-a)
  .excrept, .info
    @include TypeBody2()
    color: var(--chroma-secondary-c)
    a
      text-decoration: none
  .excrept
    a
      color: var(--chroma-secondary-c)
  .toolbar
    margin-top:8px
  .logo
    height: 72px
    width: 72px
    float: right
</style>
