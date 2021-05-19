<template>
  <div class="quickSearchResultsPanel">
    <ul v-if="searchResults && searchResults.length > 0">
      <li
        v-for="r in searchResults"
        :key="r.route"
      >
        <router-link :to="r.route">
          <Icon
            inline
            :name="r.icon"
          /> {{ r.title }}
        </router-link>
      </li>
    </ul>
    <p v-else>
      {{ $t('search.noQuickResultsHelper') }}
    </p>
  </div>
</template>

<script lang="ts">
import { useSites } from '@/state/sites'
import { useThreads } from '@/state/threads'
import { computed, defineComponent } from 'vue'
import Icon from '../material/Icon.vue'

interface Result {
  icon: string
  title: string
  route: string
}

export default defineComponent({
  components: { Icon },
  props: {
    query: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup (props) {
    const { publicSites } = useSites()
    const { stream } = useThreads()
    const searchResults = computed(() => {
      const results = new Array<Result>()

      publicSites.value.forEach((s) => {
        if (s.id.includes(props.query) || s.name.includes(props.query)) {
          results.push({
            icon: 'mekanismi',
            title: s.name,
            route: '/mekanismi/view/' + s.id + '/' + s.id
          })
        }
      })

      stream.value.forEach((t) => {
        if (t.author.includes(props.query) || t.data.title.includes(props.query)) {
          results.push({
            icon: 'discussion',
            title: t.data.title,
            route: '/thread/' + t.id + '/view'
          })
        }
      })

      results.sort((a, b) => (a.title > b.title ? 1 : -1))
      if (results.length > 14) results.length = 14

      return results
    })
    return { searchResults }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/box-shadow.sass

.quickSearchResultsPanel
  @include Rise3()
  background-color: var(--chroma-clear)
  padding: 12px
  border-radius: 20px
  position: absolute
  width: 512px
  top: 44px
  right: 12px
  ul
    margin: 0
    padding: 0
  li
    list-style: none
    margin: 0
    padding: 0
</style>
