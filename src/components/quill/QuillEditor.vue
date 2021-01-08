<template>
  <div
    v-once
    id="editor"
    :innerHTML="modelValue"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from 'vue'
import Quill from 'quill'

export default defineComponent({
  name: 'QuillEditor',
  props: {
    modelValue: { type: String, required: false, default: '' },
    toolbar: { type: Boolean, required: false, default: false }
  },
  emits: ['update:modelValue', 'new-images'],
  setup (props, context) {
    // console.log('quill.root.innerHTML', props.modelValue)
    onMounted(() => {
      const options = {
        theme: props.toolbar ? 'snow' : undefined
      }
      const quill = new Quill('#editor', options)
      quill.on('text-change', () => {
        console.log('text-change', quill.root.innerHTML)
        context.emit('update:modelValue', quill.root.innerHTML)
      })
      watch(() => props.modelValue, (val) => {
        if (quill.root.innerHTML === val) return
        console.log('quill.root.innerHTML', val)
        quill.root.innerHTML = val
      })
    })
  }
})
</script>

<style lang="sass">
@import @/styles/material-typography.sass

#editor
  .ql-editor
    h1, h2, h3, h4
     font-size: 24px
    p
      @include TypeBody2()
    p, h1, h2, h3, h4
      margin-bottom: 12px
</style>
