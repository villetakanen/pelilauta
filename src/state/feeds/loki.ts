// https://public-api.wordpress.com/rest/v1.1/sites/roolipeliloki.wordpress.com/posts?after=2020-04-01
import { computed, ref, ComputedRef } from 'vue'
import axios from 'axios'

interface FeedPost {
  URL: string,
  title: string
}
const cachedPosts = ref(new Map<string, FeedPost>())
const feedPosts = computed(() => (cachedPosts.value))

export async function fetchLoki (): Promise<void> {
  try {
    const response = await axios.get('https://public-api.wordpress.com/rest/v1.1/sites/roolipeliloki.wordpress.com/posts?after=2020-04-01')
    console.debug(response)
  } catch (e) {
    console.error(e)
  }
}

export function useLoki (): { feedPosts: ComputedRef<Map<string, FeedPost>> } {
  return { feedPosts }
}
