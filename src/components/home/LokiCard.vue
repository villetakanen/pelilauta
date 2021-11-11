<template>
  <section
    class="lokiCard rise1"
  >
    <div class="overlay">
      <img
        class="logo"
        src="@/assets/icons/loki-logo.svg"
        alt="Loki"
      >
      <h1>
        <a
          :href="feedPost.URL"
          target="_blank"
          :innerHTML="feedPost.title"
        />
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
    </div>
  </section>
</template>

<script lang="ts">
import { toDisplayString } from '@/utils/firebaseTools'
import { WordpressArticle } from '@/utils/wordpress'
import { computed, defineComponent, PropType } from 'vue'

/**
 * A simple WP card for syndication
 */
export default defineComponent({
  name: 'LokiCard',
  props: {
    feedPost: {
      type: Object as PropType<WordpressArticle>,
      required: true
    }
  },
  setup (props) {
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
    return { excerpt, toDisplayString }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass

section.lokiCard
  background-image: url('/src/loki.jpg')
  background-size: cover
  background-position: center
  position: relative
  border-radius: 12px
  box-sizing: border-box
  div.overlay
    background: rgb(0,35,55)
    background: linear-gradient(177deg, rgba(0,35,55,0.4) 0%, rgba(0,35,55,0.9) 100%)
    padding: 16px
    margin: 0
    border-radius: 12px
  img.logo
    position: absolute
    top: 12px
    right: 12px
    height: 56px
  h1
    @include TypeHeadline5()
    padding-right: 72px
    a
      color: var(--chroma-secondary-h)
  p.excrept
    @include TypeBody2()
    background-color: rgba(black, 0.3)
    padding: 8px 16px
    margin: 8px -16px
    a
      color: white
      text-decoration: none
  p.info
    @include TypeCaption()
    color: var(--chroma-secondary-f)
    a
      color: var(--chroma-secondary-h)
      text-decoration: none
section + .lokiCard
  margin-top: 12px

</style>
