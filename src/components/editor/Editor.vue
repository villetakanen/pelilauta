<template>
  <div class="toolbar">
    <div class="toolbar-action">
      <img src="@/assets/add-photo-action.svg">
    </div>
  </div>
  <div
    v-once
    class="editor"
    contenteditable="true"
    :innerHTML="content"
    @paste="onPaste"
    @input="onInput"
  />
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { setCaret, getCaretOffset } from './caret'

export default defineComponent({
  props: {
    modelValue: {
      type: ref,
      required: false,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    const content = ref(props.modelValue)

    function onPaste (event: ClipboardEvent) {
      event.preventDefault()
      event.stopPropagation()
      const pasted = event.clipboardData?.getData('text/plain')
      const selection = window.getSelection()
      if (selection && pasted) {
        selection.getRangeAt(0).insertNode(document.createTextNode(pasted))
        selection.collapseToEnd()
      }
      const target = event.target as HTMLElement
      content.value = target.innerHTML
    }

    // let cursor = [0, 0]
    // let editorElement: HTMLElement|null = null

    function onInput (event: Event) {
      const target = event.target as HTMLElement

      // this is current caret offset from the start of the element
      // at the time of @event
      const offset = getCaretOffset(target)

      let html = target.innerHTML
      // const r = new RegExp('/(?<!("|>))https?:\\/\\/[a-zA-Z.]*/', 'gmu')
      const r = new RegExp('( |&nbsp;)(https?:\\/\\/[a-zA-Z\\/_.-]*)( |&nbsp;)', 'gmu')
      html = html.replace(r, (match, p1, p2, p3) => {
        return `${p1}<a href="${p2}">${p2}</a>${p3}`
      })
      target.innerHTML = html
      content.value = target.innerHTML

      // we need to return caret to the offset after setting
      // innerHTML
      setCaret(event.target as HTMLElement, offset)
    }

    watch(content, (value) => {
      context.emit('update:modelValue', value)
    })

    watch(props.modelValue, (value) => {
      if (!value) content.value = ''
    })

    return { content, onInput, onPaste }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.editor
  //@include BoxShadow3()
  min-height: 264px
  max-height: 528px
  overflow-x
    y: scroll
  background-color: $color-base-dark
  border-bottom: solid 1px $color-primary-dark
  &:hover
    background-color: $color-base-darker
  &:focus
    background-color: $color-base-darker

.toolbar-action
  height: 46px
  width: 46px
  position: relative
  &:hover
    background-color: $color-base-dark
  img
    height: 42px
    width: 42px
    padding: 2px
    opacity: 50%
    &.small
      height: 18px
      width: 18px
      padding: 16px
    &:hover
     opacity: 77%

</style>
