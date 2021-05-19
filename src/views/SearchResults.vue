<template>
  <div class="searchResults">
    <Toolbar><h3>{{ $t('search.results.title') }}</h3></Toolbar>
    <div class="singleColumnLayout">
      <Card
        v-for="result in searchResults"
        :key="result.content"
        class="resultCard"
      >
        <router-link
          :to="`/thread/${result.objectID}/view`"
        >
          <h1
            class="title"
          >
            {{ result.title }}
          </h1>
        </router-link>
        <div
          :innerHTML="result.content"
        />
      </Card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useSearch } from '@/composables/search'
import Toolbar from '@/components/layout/Toolbar.vue'
import Card from '@/components/layout/Card.vue'

export default defineComponent({
  name: 'AppBar',
  components: {
    Toolbar,
    Card
  },
  setup () {
    const { searchResults } = useSearch()
    return { searchResults }
  }
})
</script>

<style lang="sass" scoped>
.resultCard
  a
    text-decoration: none
</style>
