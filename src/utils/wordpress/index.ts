import axios from 'axios'
import { logDebug, logEvent } from '../eventLogger'

export interface WordpressArticle {
  ID: number
  URL: string
  title: string
  date: string
  excerpt: string
}

export class WordPressSubscription {
  private sourceURL:string

  constructor (sourceURL:string) {
    this.sourceURL = sourceURL
  }

  async subscribe (): Promise<WordpressArticle[]> {
    try {
      const response = await axios.get(this.sourceURL + '?after=' + new Date(Date.now() - (1000 * 3600 * 24) * 30).toISOString().substring(0, 10))
      if (!Array.isArray(response.data.posts)) {
        logDebug(`No posts found in ${this.sourceURL}`)
        return []
      }
      logDebug(`Found ${response.data.posts.length} posts in ${this.sourceURL}`)
      const articles:WordpressArticle[] = response.data.posts.map((article:unknown) => {
        return article as WordpressArticle
      })
      return articles
    } catch (error:unknown) {
      logEvent((error as Error).message)
      return []
    }
  }
}
