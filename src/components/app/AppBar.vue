<template>
  <div id="AppBar">
    <SideNavAction />
    <h1>
      <router-link to="/">
        {{ $t('app.title') }}
      </router-link>
    </h1><form @submit.prevent="toSearch">
      <input
        v-model="searchString"
        class="searchBar"
      >
    </form>
    <img
      class="labelForSearch"
      src="@/assets/icons/search.svg"
    >
    <ProfileAction class="absoluteRight" />
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue'
import SideNavAction from '@/components/app/SideNavAction.vue'
import ProfileAction from '@/components/ProfileAction.vue'
import { useSearch } from '@/composables/search'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'AppBar',
  components: {
    SideNavAction,
    ProfileAction
  },
  setup () {
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
    return { searchString, searchResults, toSearch }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

#AppBar
  position: absolute
  top: 0
  left: 0
  width: 100vw
  height: 56px // 24 x 2 lines
  padding: 4px
  box-sizing: border-box
  border-bottom: solid 1px $color-font-disabled
  h1
    @include TypeButton()
    margin-left: 56px
    line-height: 48px
  .absoluteRight
    position: absolute
    top: 0px
    right: 0px
  .searchBar
    position: absolute
    top: 8px
    right: 56px
    height: 40px
    padding: 0 16px
    margin: 0
    border: none
    border-radius: 18px
    min-width: 30vw
    background-color: $color-fill-dark

.labelForSearch
  height: 30px
  width: 30px
  position: absolute
  top: 8px
  right: 55px
  background-color: $color-primary
  padding: 5px
  border-radius: 50%
  opacity: 50%

@include media('<=tablet')
  .searchBar
    width: 102px
    transition: width 0.3s ease
    &:focus
      width: 57vw

</style>
