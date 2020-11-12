<template>
  <div>
    <p class="caption">
      <transition name="fade">
        <span v-if="author">{{ author.nick }}</span>
      </transition>
    </p>
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
