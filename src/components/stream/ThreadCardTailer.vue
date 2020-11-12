<template>
  <div class="toolbar">
    <div class="credits">
      <transition name="fade">
        <div v-if="author">
          <p class="author">
            {{ author.nick }}
          </p>
          <p class="caption">
            {{ author.nick }}
          </p>
        </div>
      </transition>
    </div>
    <div class="spacer" />
    <div>
      <ThreadRepliesLink :thread="thread" />
    </div>
    <div class="alignRight">
      <p>
        <span v-if="thread.lovedCount > 0">
          {{ thread.lovedCount }}
        </span>
        <LoveAction
          class="inline"
          :loved="loves"
          :action="toggleLove"
        />
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { Thread } from '@/state/threads'
import { useAuthors } from '@/lib/authors'
import ThreadRepliesLink from './ThreadRepliesLink.vue'
import LoveAction from '@/components/app/LoveAction.vue'

export default defineComponent({
  name: 'ThreadCardTailer',
  components: {
    ThreadRepliesLink,
    LoveAction
  },
  props: {
    thread: {
      type: Object as PropType<Thread>,
      required: true
    }
  },
  setup (props) {
    const { authors } = useAuthors()
    const author = computed(() => (authors.value.find((val) => (val.uid === props.thread.author))))
    return { author }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.toolbar
  margin-top: 16px
  height: 48px
  div
    align-self: center
  div+div
    margin-left: 8px
.caption
  color: $color-font-disabled
.author
  margin: 0
  padding: 0
div.inline
  display: inline-block
</style>
