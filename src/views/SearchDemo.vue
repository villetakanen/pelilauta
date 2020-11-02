<template>
  <div id="appBar">
    <h1 class="viewHeader">
      [ SEARCH PROTOTYPE ]
    </h1>
    <!--div style="padding:16px; background-color: rgba(0,23,37,0.22)">
      <input
        v-model="searchString"
        class="material-textfield"
      >
    </div-->
    <MaterialCard
      v-for="result in searchResults"
      :key="result.content"
    >
      <h3>
        <router-link :to="`/stream/view/${result.objectID}`">
          {{ result.title }}
        </router-link>
      </h3>
      <div
        :innerHTML="result.content"
      />
    </MaterialCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import { useSearch } from '@/composables/search'

export default defineComponent({
  name: 'AppBar',
  components: {
    MaterialCard
  },
  setup () {
    const { searchResults, search } = useSearch()
    const searchString = ref('')
    watch(searchString, (s: string) => {
      search(s)
    })
    return { searchString, searchResults }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

</style>
