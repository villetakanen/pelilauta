<template>
  <div id="appBar">
    <h1 class="viewHeader">
      [ SEARCH DEMO PAGE ]
    </h1>
    <div style="padding:16px; background-color: rgba(0,23,37,0.22)">
      <input
        v-model="searchString"
        class="material-textfield"
      >
    </div>
    <MaterialCard
      v-for="result in searchResults"
      :key="result.content"
    >
      <h3>
        <router-link :to="`/stream/view/${result.objectID}`">{{result.title}}</router-link>
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
import algoliasearch from 'algoliasearch/lite'

interface Result {
  content: string;
  objectID: string;
  title: string;
}

export default defineComponent({
  name: 'AppBar',
  components: {
    MaterialCard
  },
  setup () {
    const searchClient = algoliasearch(
      process.env.VUE_APP_ALGOLIA_APP_ID,
      process.env.VUE_APP_ALGOLIA_APP_SEARCH_KEY
    )
    const index = searchClient.initIndex('pelilauta_discussion')
    const searchString = ref('')
    const searchResults = ref(new Array<Result>())
    watch(searchString, (s: string) => {
      if (!s || s.length < 1) {
        searchResults.value = new Array<Result>()
        return
      }
      index.search(s).then(({ hits }) => {
        console.log(hits)
        const arr: Array<Result> = hits.map((val) => ((val as unknown) as Result))
        searchResults.value = arr
      })
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
