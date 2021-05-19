<template>
  <div
    id="appBarSearch"
    class="onlyForDesktop"
  >
    <div class="inputContainer">
      <form @submit.prevent="toSearch">
        <input
          v-model="searchString"
          class="searchField"
          :disabled="isAnonymous "
          :placeholder="$t('search.placeholderText')"
        >
      </form>
      <Icon
        name="search"
        medium
        class="searchIcon"
        dark
      />
    </div>
    <QuickSearchResultsPanel
      v-if="searchString"
      :query="searchString"
      class="quickSearch"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useSearch } from '@/composables/search'
import { useRoute, useRouter } from 'vue-router'
import { useAuthState } from '@/state/authz'
import Icon from '../material/Icon.vue'
import QuickSearchResultsPanel from '../search/QuickSearchResultsPanel.vue'

export default defineComponent({
  name: 'AppBarSearch',
  components: { Icon, QuickSearchResultsPanel },
  setup () {
    const { isAnonymous } = useAuthState()
    const { searchResults, search } = useSearch()
    const searchString = ref('')
    const router = useRouter()

    function toSearch () {
      search(searchString.value)
      router.push('/search/results')
    }

    const route = useRoute()
    watch(route, () => { searchString.value = '' })

    return { isAnonymous, searchString, searchResults, toSearch }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-typography.sass

#appBarSearch
  position: relative
  .inputContainer
    background-color: var(--chroma-secondary-e) // #{'rgba(var(--chroma-primary-c-rgba), 0.22)'}
    height: 40px
    position: relative
    border-radius: 20px
    padding: 0
    padding-right: 36px
    margin: 4px
    .searchField
      border: none
      height: 32px
      border-radius: 16px
      padding: 0 12px
      margin: 4px
      width: 200px
      color: var(--chroma-primary-d)
    .searchIcon
      position: absolute
      right: 2px
      top: 2px
      padding: 0
      margin: 0
    .quickSearch
      position: absolute
      top: 44px
      left: -200px
</style>
