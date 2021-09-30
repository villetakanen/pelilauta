<template>
  <div
    class="richTextView"
    :innerHTML="deltaAsHTML"
  />
  <pre>{{ deltaAsHTML }}</pre>
  <pre> {{ deltaContent }} </pre>
</template>

<script lang="ts">
import { DeltaOperation } from '@/utils/contentFormat'
import { defineComponent, computed, PropType } from 'vue'
// import { DeltaParser } from './DeltaParser'

export default defineComponent({
  name: 'RitchTextView',
  props: {
    deltaContent: {
      type: Array as PropType<Array<DeltaOperation>>,
      required: true
    }
  },
  setup (props) {
    const deltaAsHTML = computed(() => {
      // parser.setOps(props.deltaContent)
      return '' // parser.renderHTML()
    })

    return { deltaAsHTML }
  }
})
</script>
