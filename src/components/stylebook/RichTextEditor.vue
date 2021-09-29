<template>
  <Column class="textStyles">
    <h1>Ritch Text Editor</h1>
    <p>We use the @next npm build of Quill.js, with custom parchment, as the ritch text editor.</p>
    <p>At 10.0.0 the content of the editor is saved as HTML, but saving the Delta might make more sense in the future.</p>
    <h2>Demo of the Editor</h2>
  </Column>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Column from '../layout/Column.vue'

export default defineComponent({
  name: 'TextStyles',
  components: { Column },
  setup () {
  }
})
</script>
