<template>
  <MaterialCard>
    <ThreadCardHeader :thread="thread" />
    <div class="cardGrid">
      <div class="cardContent">
        <div
          :innerHTML="thread.data.content"
          class="cardContent dont-break-out"
        />
        <div class="credits">
          <transition name="fade">
            <div v-if="author">
              <p class="author">
                {{ author.nick }}
              </p>
              <p
                v-if="author.tagline"
                class="caption"
              >
                {{ author.tagline }}
              </p>
            </div>
          </transition>
        </div>
      </div>
      <div
        v-if="thread.data.images && thread.data.images.length > 0"
        class="cardPoster"
      >
        <ImageBox
          :images="thread.data.images"
        />
      </div>
    </div>
    <ThreadCardTailer
      :thread="thread"
      @updated="updated"
    />
  </MaterialCard>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { Thread } from '@/state/threads'
import MaterialCard from '@/components/material/MaterialCard.vue'
import ThreadCardHeader from './ThreadCardHeader.vue'
import ThreadCardTailer from './ThreadCardTailer.vue'
import ImageBox from '@/components/material/ImageBox.vue'
import { useAuthors } from '@/lib/authors'

export default defineComponent({
  name: 'ThreadCard',
  components: {
    MaterialCard,
    ThreadCardHeader,
    ThreadCardTailer,
    ImageBox
  },
  props: {
    thread: {
      type: Object as () => Thread,
      required: true
    }
  },
  emits: ['updated'],
  setup (props, context) {
    const updated = () => {
      context.emit('updated')
    }
    const { authors } = useAuthors()
    const author = computed(() => (authors.value.find((val) => (val.uid === props.thread.author))))
    return { updated, author }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.cardContent
  color: $color-font-medium
  position: relative
  padding-bottom: 16px

.credits
  position: absolute
  bottom: 0
  left: 0

.author
  @include TypeCaption()
  color: $color-font-high
  margin: 0
  padding: 0

@include media('>tablet')
  .cardGrid
    display: flex
    justify-content: space-between
    align-items: stretch // flex-start
    .cardPoster
      margin-right: -16px
      margin-left: 16px

</style>
