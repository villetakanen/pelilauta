<template>
  <div
    class="resolvedAuthorTag"
    @click="reroute('/u/' + author.uid)"
  >
    @ {{ author.nick }}
  </div>
</template>

<script lang="ts">
import { useUxActions } from '@/composables/useUxActions'
import { useAuthors } from '@/state/authors'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'AuthorLink',
  props: {
    uid: {
      type: String,
      required: true
    }
  },
  async setup (props) {
    const { fetchAuthor } = useAuthors()
    const { reroute } = useUxActions()
    const author = ref(await fetchAuthor(props.uid))
    return { author, reroute }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass

.resolvedAuthorTag
  @include TypeCaption
  line-height: 20px
  height: 20px
  margin: 0px
  padding: 2px 10px
  border-radius: 12px
  background-color: var(--chroma-secondary-i)
  color: var(--chroma-secondary-d)
  display: inline-block
</style>
