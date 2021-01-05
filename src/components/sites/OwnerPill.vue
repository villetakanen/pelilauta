<template>
  <Pill>{{ owner.nick }}</Pill>
</template>

<script lang="ts">
import { useAuthors } from '@/lib/authors'
import { computed, defineComponent } from 'vue'
import Pill from '../material/Pill.vue'

export default defineComponent({
  components: { Pill },
  props: {
    uid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { getAuthor } = useAuthors()
    const owner = computed(() => (getAuthor(props.uid)))
    return { owner }
  }
})
</script>
