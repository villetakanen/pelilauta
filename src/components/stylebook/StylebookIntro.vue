<template>
  <Column class="textStyles">
    <h1>Stylebook</h1>
    <p>
      This page acts as a kind of a Diary for the UX and UI design for the app. Additionally, it is a very convinient way to test and document usage
      of UX/UI practices, tooling, components, and styles in the codebase.
    </p>
  </Column>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Column from '../layout/Column.vue'

export default defineComponent({
  name: 'StyleBookIntro',
  components: { Column }
})
</script>
