<template>
  <Card
    class="threadCard"
    :class="{ pinned: pinned, small: small }"
    :rise="2"
  >
    <div class="content">
      <div
        v-if="thread.data.images && thread.data.images.length > 0"
        class="imageframe"
        :style="`background-image: url('${thread.data.images[0].url}')`"
      />
      <ThreadCardHeader :thread="thread" />
      <p
        v-if="!thread.data.youTubeSlug"
        class="contentSnippet"
      >
        {{ snippet }}
      </p>
      <div v-if="thread.data.youTubeSlug">
        <iframe
          title="Youtube Preview"
          class="youtubePreview"
          :src="`https://www.youtube.com/embed/${thread.data.youTubeSlug}?enablejsapi=1&origin=http://example.com`"
          frameborder="0"
        />
      </div>
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
              <router-link :to="`/thread/${thread.id}/view/from/${seen}`">
                {{ thread.replyCount ? thread.replyCount + ' ' + $t('post.nOfReplies') : $t('post.more') }}
              </router-link>
            </Pill>
            <p
              v-else
              class="topic"
              style="position: absolute; top: 0; right : 10px"
            >
              <router-link :to="`/thread/${thread.id}/view/from/${seen}`">
                {{ thread ? thread.replyCount + ' ' + $t('post.nOfReplies') : $t('post.more') }}
              </router-link>
            </p>
          </div>
        </transition>
      </div>
    </div>
    <ThreadCardTailer2 :thread="thread" />
  </Card>
</template>

<script lang="ts">
import { useAuthors } from '@/state/authors'
import { useMeta } from '@/state/meta'
import { loveThread, unloveThread } from '@/state/threads'
import { Thread } from '@/utils/firestoreInterfaces'
import { computed, defineComponent, PropType } from 'vue'
import { toDisplayString } from '@/utils/firebaseTools'
import Card from '../../layout/Card.vue'
import LoveAThreadAction from '../../thread/LoveAThreadAction.vue'
import { useAuthState, useProfile } from '@/state/authz'
import Pill from '../../material/Pill.vue'
import ThreadCardHeader from './ThreadCardHeader.vue'
import ThreadCardTailer2 from './ThreadCardTailer2.vue'

export default defineComponent({
  name: 'WelcomeCard',
  components: { Card, LoveAThreadAction, Pill, ThreadCardHeader, ThreadCardTailer2 },
  props: {
    thread: {
      type: Object as PropType<Thread>,
      required: true
    },
    pinned: {
      type: Boolean,
      required: false,
      default: false
    },
    small: {
      type: Boolean,
      required: false,
      default: false
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
    const { hasSeen, profileMeta, seenFrom } = useProfile()
    const newReplies = computed(() => (
      !isAnonymous.value &&
      !hasSeen(props.thread.id, props.thread.flowTime) &&
      props.thread.replyCount > 0
    ))
    const seen = computed(() => (seenFrom(props.thread.id)))
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

    return { snippet, topicName, author, toDisplayString, authoruid, newReplies, toggleLove, loves, seen }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-typography.sass
div.threadCard
  color: var(--chroma-secondary-a)
  p.subtitle
    @include TypeBody2()
    display: block
    line-height: 16px
    margin-top: -7px
    padding-top: 4px
    padding-left: 4px
    border-top: solid 1px var(--chroma-secondary-h)
    margin-bottom: 12px
    font-weight: 100
    background-color: var(--chroma-secondary-i)
    a
      color: var(--chroma-secondary-b)
  a
    text-decoration: none
    color: var(--chroma-primary-c)
  h1
    @include TypeCardHeadline()
    // color: var(--chroma-secondary-e)
    margin-top: 0
    padding-top: 0
    a
      color: var(--chroma-secondary-b)
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
.pinned
  background-color: var(--chroma-secondary-i)
.youtubePreview
  width: 548px
  height: calc(548px / 16 * 9)

@include media('>=tablet')
  div.threadCard.small
    .youtubePreview
      width: 464px
      height: calc(464px / 16 * 9)

@include media('<tablet')
  div.threadCard
    .youtubePreview
      width: calc(100vw - 48px)
      height: calc((100vw - 48px) / 16 *9 )
</style>