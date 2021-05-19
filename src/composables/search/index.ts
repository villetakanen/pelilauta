import { ref, Ref } from 'vue'
import algoliasearch from 'algoliasearch/lite'

export interface SearchResult {
  content: string;
  objectID: string;
  title: string;
}

const searchResults = ref(new Array<SearchResult>())

const searchClient = algoliasearch(
  process.env.VUE_APP_ALGOLIA_APP_ID,
  process.env.VUE_APP_ALGOLIA_APP_SEARCH_KEY
)
const index = searchClient.initIndex('pelilauta_discussion')

function search (s: string) {
  if (!s || s.length < 1) {
    searchResults.value = new Array<SearchResult>()
    return
  }
  index.search(s).then(({ hits }) => {
    console.log(hits)
    const arr: Array<SearchResult> = hits.map((val) => ((val as unknown) as SearchResult))
    searchResults.value = arr.reverse()
  })
}

export function useSearch (): { searchResults: Ref<Array<SearchResult>>; search: CallableFunction } {
  return { searchResults, search }
}
