<template>
  <MaterialCard class="welcomeCard">
    <div class="content">
      <div
        v-if="thread.data.images.length > 0"
        class="imageframe"
        :style="`background-image: url('${thread.data.images[0].url}')`"
      />
      <h1>{{ thread.data.title }}</h1>
      <p class="caption">
        {{ toDisplayString(thread.created) }} -
        <transition name="fade">
          <span
            v-if="author"
          >
            {{ author.nick }}
          </span>
        </transition>
      </p>
      <p>{{ snippet }}</p>
    </div>
    <div class="toolbar">
      <div class="caption">
        <p class="caption">Aiheessa {{ topicName }}</p>
      </div>
      <div class="spacer" />
      <div>Love</div>
      <div>replies</div>
    </div>
  </MaterialCard>
</template>

<script lang="ts">
import { useAuthors } from '@/state/authors'
import { useMeta } from '@/state/meta'
import { Thread } from '@/state/threads'
import { computed, defineComponent, PropType } from 'vue'
import { toDisplayString } from '@/utils/firebaseTools'
import MaterialCard from '../material/MaterialCard.vue'
/**
 * A simple welcome card for anonymous visitors
 */
export default defineComponent({
  name: 'WelcomeCard',
  components: { MaterialCard },
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
        if (snip.length > 48) snip = snip.substring(0, 48) + '...'
      }
      return snip
    })
    const { streams } = useMeta()
    const topicName = computed(() => {
      return streams.value.find((val) => (val.slug === props.thread.data.topic))?.name
    })
    const { authors } = useAuthors()
    const author = computed(() => (authors.value.find((val) => (val.uid === props.thread.author))))
    return { snippet, topicName, author, toDisplayString }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass
.toolbar
  div
    height: 24px
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
