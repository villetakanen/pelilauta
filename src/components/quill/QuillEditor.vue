<template>
  <div>a</div>
  <div id="editor">
    <p>Testing?</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import Quill from 'quill'

export default defineComponent({
  name: 'QuillEditor',
  setup () {
    onMounted(() => {
      const options = {
      }
      const editor = new Quill('#editor', options)
    })
  }
})

</script>
