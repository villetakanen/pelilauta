<template>
  <div>
    <h1>Editortest.vue</h1>
    <div class="test-container">
      <div class="test-box">
        <Editor v-model="content" />
      </div>
      <div class="test-box">
        <div
          id="result"
          :innerHTML="content"
        />
        <hr>
        {{ content }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Editor from '@/components/editor/Editor.vue'

export default defineComponent({
  name: 'EditorTest',
  components: {
    Editor
  },
  setup () {
    const content = ref('')
    return { content }
  }
})
</script>

<style lang="sass" scoped>
.test-container
  display: flex
  flex-basis: 400px
  .test-box
    width: 400px
    flex-flow: 0
    flex-flex-shrink: 0

</style>
