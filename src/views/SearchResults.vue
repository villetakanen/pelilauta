<template>
  <div class="searchResults">
    <Header>
      <ViewTitle icon="search">
        {{ $t('search.results.title') }}
      </ViewTitle>
    </Header>
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
import Card from '@/components/layout/Card.vue'
import Header from '@/components/layout/Header.vue'
import ViewTitle from '@/components/layout/ViewTitle.vue'

export default defineComponent({
  name: 'AppBar',
  components: {
    Card,
    Header,
    ViewTitle
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
