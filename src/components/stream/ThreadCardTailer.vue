<template>
  <div class="toolbar">
    <div class="credits">
      <transition name="fade">
        <div v-if="author">
          <p class="author">{{ author.nick }}</p>
          <p class="caption">
            {{ author.nick }}
          </p>
        </div>
      </transition>
    </div>
    <div class="spacer" />
    <div>
      <div>likes</div>
      <div>responses</div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { Thread } from '@/state/threads'
import { useAuthors } from '@/lib/authors'
// import firebase from 'firebase/app'
// import 'firebase/firestore'
// import { useI18n } from 'vue-i18n'
// import MaterialCard from '@/components/material/MaterialCard.vue'

export default defineComponent({
  name: 'ThreadCardHeader',
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
.caption
  color: $color-font-disabled
.author
  margin: 0
  padding: 0
</style>
