<template>
  <div
    ref="editorField"
    class="editorField"
    contenteditable="true"
    :innerHTML="modelValue"
    @paste="onPaste"
    @blur="onBlur"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { processContent } from './processors'

export default defineComponent({
  name: 'Editor2',
  props: {
    modelValue: { type: String, required: false, default: '' },
    color: { type: String, required: false, default: '' }
  },
  emits: ['update:modelValue', 'new-images'],
  setup (props, context) {
    const editorClasses = ref({
      'colortheme-secondary': false
    })
    if (props.color === 'secondary') editorClasses.value['colortheme-secondary'] = true

    const updateModelValue = (val: string):void => {
      const { update, newImages } = processContent(val)
      if (newImages && newImages.length > 0) context.emit('new-images', newImages)
      context.emit('update:modelValue', update)
    }
    const onBlur = (event: Event) => {
      updateModelValue((event.target as HTMLElement).innerHTML)
    }
    const onPaste = (event: ClipboardEvent) => {
      event.preventDefault()
      event.stopPropagation()
      const pasted = event.clipboardData?.getData('text/plain')
      const selection = window.getSelection()
      if (selection && pasted) {
        selection.getRangeAt(0).insertNode(document.createTextNode(pasted))
        selection.collapseToEnd()
      }
      let el = (event.target as HTMLElement)
      while (!el.classList.contains('editorField')) {
        // console.log(el.classList)
        if (el.parentElement === null) throw Error('Paste fails to find the editor field')
        el = el.parentElement
      }
      updateModelValue(el.innerHTML)
    }
    return { onBlur, onPaste }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/layout.sass
@import @/styles/material-typography.sass
@import @/styles/include-media.scss

.editorField
  display: block
  margin: 0
  padding: 8px
  min-height: 264px
  max-height: 264px
  background-color: $color-base-dark
  border-bottom: solid 1px $color-fill-primary-dark
  overflow: hidden
  &:hover
    background-color: $color-base-darker

.editorField.colortheme-secondary
  border-bottom: solid 1px $color-secondary-dark

</style>
