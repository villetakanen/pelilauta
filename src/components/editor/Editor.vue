<template>
  <div class="editor" contenteditable="true" v-on:paste="onPaste" @input="onInput" v-once :innerHTML="content"></div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { setCaret, getCaretOffset } from './caret'

export default defineComponent({
  props: ['modelValue'],
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
        console.log('match!', match, p1)
        return `${p1}<a href="${p2}">${p2}</a>${p3}`
      })
      target.innerHTML = html
      content.value = target.innerHTML

      // we need to return caret to the offset after setting
      // innerHTML
      setCaret(event.target as HTMLElement, offset)
    }

    watch(content, (value) => {
      // console.log('changed')
      context.emit('update:modelValue', value)
      // setCursorPosition(editorElement, cursor)
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
  min-height: 72px
  max-height: 11em
  overflow: scroll
  background-color: white
  border-bottom: solid 1px rgba(0,23,37, 0.4)

</style>
