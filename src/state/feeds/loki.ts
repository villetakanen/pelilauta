// https://public-api.wordpress.com/rest/v1.1/sites/roolipeliloki.wordpress.com/posts?after=2020-04-01
import { computed, ref, ComputedRef } from 'vue'
import axios from 'axios'

export interface FeedPost {
  ID: number,
  URL: string,
  title: string,
  date: string,
  excerpt: string
}

const cachedPosts = ref(new Map<string, FeedPost>())
const feedPosts = computed(() => (cachedPosts.value))

export async function fetchLoki (): Promise<void> {
  try {
    const response = await axios.get('https://public-api.wordpress.com/rest/v1.1/sites/roolipeliloki.wordpress.com/posts?after=2020-04-01')
    console.debug(response)
    if (Array.isArray(response.data.posts)) {
      response.data.posts.forEach((item:any) => {
        const post = item as FeedPost
        cachedPosts.value.set('' + post.ID, post)
      })
    }
    console.debug('fetchLoki', feedPosts.value)
  } catch (e) {
    console.error(e)
  }
}
let _init = false
export function useLoki (): { feedPosts: ComputedRef<Map<string, FeedPost>> } {
  if (!_init) {
    _init = true
    fetchLoki()
  }
  return { feedPosts }
}
