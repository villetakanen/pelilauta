<template>
  <div class="wikiChangesItem">
    <div class="site">
      <div class="time">
        {{ change }}
      </div>
      {{ siteName }}
    </div>
    <div class="page">
      <router-link :to="`/site/${siteid}/page/${pageid}`">
        {{ name }}
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { useSites } from '@/state/sites'
import { computed, defineComponent } from 'vue'
/**
 * A simple welcome card for anonymous visitors
 */
export default defineComponent({
  name: 'WikiChangesItem',
  props: {
    name: {
      type: String,
      required: true
    },
    pageid: {
      type: String,
      required: true
    },
    siteid: {
      type: String,
      required: true
    },
    change: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { publicSites } = useSites()
    const siteName = computed(() => (publicSites.value.find((a) => (a.id === props.siteid))?.name || props.siteid))
    return { siteName }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass
@import @/styles/include-media.scss

div.site
  @include TypeBody2()
  color: var(--chroma-primary-h)
  line-height: 20px
  margin: 0
  padding: 0
  div.time
    color: var(--chroma-primary-e)
    float: right
div.page
  @include TypeBody2()
  line-height: 20px
  margin: 0
  padding: 0
  margin-bottom: 8px
  a
    color: var(--chroma-clear )
    text-decoration: none

@include media('<tablet')
  div.site
    div.time
      display: none
</style>
