<template>
  <section class="ThreadListItem">
    <h3>{{ title }}</h3>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ThreadListItem',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup () {
  }
})
</script>

<style lang="sass" scoped>
section.ThreadListItem + section.ThreadListItem
  border-top: dashed var(--chroma-alert) 1px
</style>
