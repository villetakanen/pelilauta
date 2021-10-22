<template>
  <Column class="statefulcomponents">
    <section>
      <h1>Some stateful components</h1>
      <p>Some of the vue components (with state) are used across the app. Most significant should be documented here for ease of use.</p>
    </section>
    <section>
      <h2>Author links</h2>
      <p><AuthorLink uid="4fN0HG08edQ1Bi3t3zHyXllCPnz2" /></p>
      <p>[authortag]</p>
    </section>
  </Column>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AuthorLink from '../author/AuthorLink.vue'
import Column from '../layout/Column.vue'

export default defineComponent({
  name: 'StatefulComponents',
  components: { Column, AuthorLink },
  setup () {
  }
})
</script>
