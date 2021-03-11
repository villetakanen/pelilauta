<template>
  <span class="authorLink">
    <transition name="fade">
      <router-link
        v-if="nick"
        :to="{ name: 'profile.public', params: { uid: uid }}"
      >
        {{ nick }}
      </router-link>
    </transition>
  </span>
</template>

<script lang="ts">
import { useAuthors } from '@/state/authors'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'AuthorLink',
  props: {
    uid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { authors } = useAuthors()
    const nick = computed(() => (authors.value.find((a) => (a.uid === props.uid))?.nick || ''))
    return { nick }
  }
})
</script>
