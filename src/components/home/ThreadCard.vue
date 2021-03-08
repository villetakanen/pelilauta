<template>
  <Card class="welcomeCard">
    <div class="content">
      <div
        v-if="thread.data.images && thread.data.images.length > 0"
        class="imageframe"
        :style="`background-image: url('${thread.data.images[0].url}')`"
      />
      <h1>
        <router-link :to="`/thread/${thread.id}/view`">
          {{ thread.data.title }}
        </router-link>
      </h1>
      <p class="contentSnippet">
        {{ snippet }}
      </p>
      <p class="meta">
        <transition name="fade">
          <span
            v-if="author"
          >
            <router-link :to="{ name: 'profile.public', params: { uid: thread.author }}">
              {{ author.nick }}
            </router-link>
          </span>
        </transition>
        {{ toDisplayString(thread.created) }}
      </p>
    </div>
    <div class="toolbar">
      <LoveAThreadAction
        :authorid="authoruid"
        :loves="loves"
        :action="toggleLove"
        :count="thread.lovedCount"
        style="margin-right: 8px"
      />
      <div>
        <p class="topic">
          {{ $t('stream.inStream') }} <router-link :to="`/stream/topic/${thread.data.topic}`">
            {{ topicName }}
          </router-link>
        </p>
      </div>
      <div class="spacer" />
      <div
        class="replies"
        style="position: relative"
      >
        <transition name="fade">
          <div
            style="width: 120px;position:relative; text-align: right"
          >
            <Pill
              v-if="newReplies"
              small
              prepend-icon="send"
              dark
            >
              <router-link :to="`/thread/${thread.id}/view`">
                {{ thread.replyCount ? thread.replyCount + ' ' + $t('post.nOfReplies') : $t('post.more') }}
              </router-link>
            </Pill>
            <p
              v-else
              class="topic"
              style="position: absolute; top: 0; right : 10px"
            >
              <router-link :to="`/thread/${thread.id}/view`">
                {{ thread ? thread.replyCount + ' ' + $t('post.nOfReplies') : $t('post.more') }}
              </router-link>
            </p>
          </div>
        </transition>
      </div>
    </div>
  </Card>
</template>

<script lang="ts">
import { useAuthors } from '@/state/authors'
import { useMeta } from '@/state/meta'
import { loveThread, Thread, unloveThread } from '@/state/threads'
import { computed, defineComponent, PropType } from 'vue'
import { toDisplayString } from '@/utils/firebaseTools'
import Card from '../layout/Card.vue'
import LoveAThreadAction from '../thread/LoveAThreadAction.vue'
import { useAuthState, useProfile } from '@/state/authz'
import Pill from '../material/Pill.vue'
/**
 * A simple welcome card for anonymous visitors
 */
export default defineComponent({
  name: 'WelcomeCard',
  components: { Card, LoveAThreadAction, Pill },
  props: {
    thread: {
      type: Object as PropType<Thread>,
      required: true
    }
  },
  setup (props) {
    const snippet = computed(() => {
      const div = document.createElement('div')
      div.innerHTML = props.thread.data.content
      let snip = ''
      if (div.firstChild) {
        snip = div.firstChild.textContent || ''
        if (snip.length > 72) snip = snip.substring(0, 72) + '...'
      }
      return snip
    })
    const { streams } = useMeta()
    const topicName = computed(() => {
      return streams.value.find((val) => (val.slug === props.thread.data.topic))?.name
    })
    const { authors } = useAuthors()
    const author = computed(() => (authors.value.find((val) => (val.uid === props.thread.author))))
    const authoruid = computed(() => (author.value?.uid || ''))
    const { isAnonymous, uid } = useAuthState()
    const { hasSeen, profileMeta } = useProfile()
    const newReplies = computed(() => (
      !isAnonymous.value &&
      !hasSeen(props.thread.id, props.thread.flowTime) &&
      props.thread.replyCount > 0
    ))
    const loves = computed(() => {
      if (typeof profileMeta.value.lovedThreads === 'undefined') return false
      return profileMeta.value.lovedThreads.includes(props.thread.id)
    })

    async function toggleLove () {
      // no-op if the author is trying to love their own posts
      if (props.thread.author === uid.value) return
      // love/unlove
      if (loves.value) {
        return unloveThread(uid.value, props.thread.id).then(() => {
        })
      } else {
        return loveThread(uid.value, props.thread.id).then(() => {
        })
      }
    }
    return { snippet, topicName, author, toDisplayString, authoruid, newReplies, toggleLove, loves }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass
div.welcomeCard
  color: var(--chroma-secondary-c)
  margin: 0
  margin-bottom: 8px
  a
    text-decoration: none
    color: var(--chroma-primary-c)
  h1
    @include TypeHeadline5()
    color: var(--chroma-secondary-e)
    margin-top: 0
    padding-top: 0
    a
      color: var(--chroma-secondary-e)
  p.meta
    // text-align: right
    @include TypeCaption()
    color: var(--chroma-secondary-b)
    margin-bottom: 8px
  .contentSnippet
    @include TypeBody2()
    margin-top: 0px
    margin-bottom: 8px
    color: var(--chroma-secondary-c)
  .toolbar
    align-items: center
    div
      height: 24px
      p.topic
        @include TypeCaption()
        line-height: 24px
        color: var(--chroma-secondary-a)
  .imageframe
    height: 72px
    width: 72px
    float: right
    background-size: cover
    border-radius: 6px
    margin: 0px
    margin-left: 8px
    margin-bottom: 8px
</style>
