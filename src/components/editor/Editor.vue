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

    /* const value = computed({
      get: () => { return content.value },
      set: (value: string) => {
        content.value = value
         context.emit('update:modelValue', value)
      }
    }) */

    /* / node_walk: walk the element tree, stop when func(node) returns false
    function nodeWalk (node: Element, func: Function) {
      let result = func(node)
      for (node = node.firstChild as Element; result !== false && node; node = node.nextSibling as Element) { result = nodeWalk(node, func) }
      return result
    };

    /* / getCaretPosition: return [start, end] as offsets to elem.textContent that
    //   correspond to the selected portion of text
    //   (if start == end, caret is at given position and no text is selected)
    function getCaretPosition (elem: Element): number[] {
      const sel = window.getSelection()
      let cumLength = [0, 0]
      if (sel === null) return cumLength

      if (sel.anchorNode === elem) { cumLength = [sel.anchorOffset, sel.focusOffset] } else {
        const nodesToFind = [sel.anchorNode, sel.focusNode]
        if (!elem.contains(sel.anchorNode) || !elem.contains(sel.focusNode)) { return [0, 0] } else {
          const found = [false, false]
          let i
          nodeWalk(elem, function (node: Element) {
            for (i = 0; i < 2; i++) {
              if (node === nodesToFind[i] as Element) {
                found[i] = true
                if (found[i === 0 ? 1 : 0]) { return false } // all done
              }
            }

            if (node.textContent && !node.firstChild) {
              for (i = 0; i < 2; i++) {
                if (!found[i]) { cumLength[i] += node.textContent.length }
              }
            }
          })
          cumLength[0] += sel.anchorOffset
          cumLength[1] += sel.focusOffset
        }
      }
      if (cumLength[0] <= cumLength[1]) { return cumLength }
      return [cumLength[1], cumLength[0]]
    } */

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
      const r = new RegExp('( |&nbsp;)(https?fic:\\/\\/[a-zA-Z_.-]*)( |&nbsp;)', 'gmu')
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
      console.log('changed')
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
  @include BoxShadow3()
  min-height: 1em

</style>
