<template>
  <div id="AppBar">
    <SideNavAction />
    <h1>
      <router-link to="/">
        {{ $t('app.title') }}
      </router-link>
    </h1>
    <input
      v-model="searchString"
      class="searchBar"
      @input="toSearch"
    >
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
    watch(searchString, (s: string) => {
      search(s)
    })
    const router = useRouter()
    function toSearch () {
      router.push('/search/results')
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
    height: 36px
    padding: 0 16px
    margin: 0
    border: solid 1px $color-font-disabled
    border-radius: 18px
    min-width: 30vw

.labelForSearch
  height: 28px
  width: 28px
  position: absolute
  top: 12px
  right: 66px

@include media('<=tablet')
  .searchBar
    width: 102px
    transition: width 0.3s ease
    &:focus
      width: 57vw

</style>
