<template>
  <div id="AppBarSearch">
    <form @submit.prevent="toSearch">
      <input
        v-model="searchString"
        class="searchBar"
        :disabled="!isAuthz"
      >
    </form>
    <img
      id="labelForSearch"
      src="@/assets/icons/search.svg"
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useAuthz } from '@/lib/authz'
import { useSearch } from '@/composables/search'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'AppBarSearch',
  setup () {
    const { isAuthz } = useAuthz()
    const { searchResults, search } = useSearch()
    const searchString = ref('')
    const router = useRouter()
    function toSearch (event: Event) {
      console.log((event as KeyboardEvent).key)
      // if ((event as KeyboardEvent).key === '13') {
      search(searchString.value)
      router.push('/search/results')
      // }
    }
    return { isAuthz, searchString, searchResults, toSearch }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

#AppBarSearch
  position: relative
  padding: 8px
  margin: 0 8px
  input
    box-sizing: border-box
    background-color: $color-fill-primary-light
    border: none
    margin: 0
    padding: 4px 8px
    line-height: 24px
    min-width: 200px
    color: $color-dark-font-medium
    transition: min-width 0.3s ease
    &:focus
      min-width: 57vw
  #labelForSearch
    position: absolute
    background-color: $color-fill-primary-dark
    height: 20px
    width: 20px
    padding: 2px
    top: 12px
    right: 12px

@include media('<=tablet')
  #AppBarSearch
    input
      width: 70px
      min-width: 70px

</style>
