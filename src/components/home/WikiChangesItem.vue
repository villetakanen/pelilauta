<template>
  <div class="wikiChangesItem">
    <router-link :to="`/site/${siteid}/page/${pageid}`">
      <Icon
        class="badge"
        headline
        dark
        :name="badge + '-logo'"
      />
      <div class="site">
        <div class="time">
          {{ change }}
        </div>
        {{ siteName }}
      </div>
      <div class="page">
        {{ name }}
      </div>
    </router-link>
  </div>
</template>

<script lang="ts">
import { useSites } from '@/state/sites'
import { computed, defineComponent } from 'vue'
import Icon from '../material/Icon.vue'
/**
 * A simple welcome card for anonymous visitors
 */
export default defineComponent({
  name: 'WikiChangesItem',
  components: { Icon },
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
    },
    badge: {
      type: String,
      required: false,
      default: 'mekanismi'
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

.wikiChangesItem
  position: relative
  .badge
    position: absolute
    top: 0
    left: 0
    margin: 0
    padding: 0
    opacity: 0.42
  .site, .page
    margin-left: 54px
  a
    text-decoration: none
    .page
      color: white
    .site
      color: var(--chroma-secondary-g)
div.site
  @include TypeBody2()
  color: var(--chroma-primary-h)
  line-height: 20px
  padding: 0
  div.time
    color: var(--chroma-secondary-f)
    float: right
div.page
  @include TypeBody2()
  line-height: 20px
  margin: 0
  padding: 0
  margin-bottom: 8px
  a
    color: var(--chroma-secondary-i)
    text-decoration: none

@include media('<tablet')
  div.site
    div.time
      display: none
</style>
