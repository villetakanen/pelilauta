import { computed, ref } from 'vue'
import { FeedPost } from './loki'
import axios from 'axios'

class WordpressFeed {
  cachedPosts = ref(new Map<string, FeedPost>())
  feedPosts = computed(() => (this.cachedPosts.value))

  constructor (rssFeedUrl:URL) {
    console.debug('creating a new Wordpress Feed for', rssFeedUrl.href)
    this.subscribe(rssFeedUrl)
  }

  subscribe = async (rssFeedUrl:URL) => {
    try {
      const response = await axios.get(rssFeedUrl.href + '?after=2020-04-01')
      if (Array.isArray(response.data.posts)) {
        response.data.posts.forEach((item:unknown) => {
          const post = item as FeedPost
          this.cachedPosts.value.set('' + post.ID, post)
        })
      }
    } catch (e) {
      console.error(e)
    }
  }
}

const feeds = new Map<URL, WordpressFeed>()

export function createFeed (rssFeedUrl:URL): WordpressFeed {
  const a = feeds.get(rssFeedUrl) || new WordpressFeed(rssFeedUrl)
  if (!feeds.has(rssFeedUrl)) feeds.set(rssFeedUrl, a)
  return a
}
