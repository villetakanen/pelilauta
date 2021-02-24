<template>
  <div>{{ site }}</div>
  <hr>
  <div>{{ page }}</div>
</template>

<script lang="ts">
import { Page, Site } from '@/state/site'
import { defineComponent, PropType } from 'vue'

/**
 * An editor form for a Wiki Page.
 */
export default defineComponent({
  name: 'ThreadEditor',
  components: {
  },
  props: {
    site: {
      type: Object as PropType<Site>,
      required: true
    },
    page: {
      type: Object as PropType<Page>,
      required: true
    }
  }
})
</script>
