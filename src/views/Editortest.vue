<template>
  <div>
    <h1>Editortest.vue</h1>
    <div class="test-container">
      <div class="test-box">
        <Editor
          v-model="content"
          v-model:images="images"
        />
      </div>
      <div class="test-box">
        <div
          id="result"
          :innerHTML="content"
        />
        <hr>
        {{ content }}
        <hr>
        <img
          v-for="url in images.split(';')"
          :key="url"
          :src="url"
        >
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
    // watch(content, (val) => { console.log(val) })

    const images = ref('')
    // watch(images, (val) => { console.log('images!', val) })

    return { content, images }
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
