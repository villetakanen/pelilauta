<template>
  <div class="wikiChangesItem">
    <router-link :to="`/site/${siteid}/page/${page.id}`">
      <Icon
        class="badge"
        medium
        dark
        :name="site.system + '-logo'"
      />
      <div class="site">
        <div class="time">
          {{ toDisplayString(site.updatedAt) }}
        </div>
        {{ site.name }}
      </div>
      <div class="page">
        {{ page.name || site.name }}
      </div>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Site } from '@/state/site/Site'
import { useSites } from '@/state/sites'
import { computed, defineComponent } from 'vue'
import Icon from '../material/Icon.vue'
import { toDisplayString } from '@/utils/firebaseTools'
/**
 * A simple welcome card for anonymous visitors
 */
export default defineComponent({
  name: 'WikiChangesItem',
  components: { Icon },
  props: {
    siteid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { visibleSites } = useSites()
    const site = computed(() => (visibleSites.value.find((a) => (a.id === props.siteid))) || new Site())
    const page = computed(() => site.value.latestPages[0] || { id: props.siteid, name: '', author: '' })
    return { site, page, toDisplayString }
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
