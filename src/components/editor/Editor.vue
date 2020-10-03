<template>
  <div class="editor" contenteditable="true" v-on:paste="onPaste" @input="onInput" v-once :innerHTML="content"></div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

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

    // node_walk: walk the element tree, stop when func(node) returns false
    function nodeWalk (node: Element, func: Function) {
      let result = func(node)
      for (node = node.firstChild as Element; result !== false && node; node = node.nextSibling as Element) { result = nodeWalk(node, func) }
      return result
    };

    // getCaretPosition: return [start, end] as offsets to elem.textContent that
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
    }

    interface Cursor {
      node: Node|null;
      offset: number;
    }

    function findCursorPosition (current: Node, offset: number, parent?: Node): Cursor {
      if (!parent) parent = current
      if (offset === 0) return { node: current, offset }
      // We are in text
      if (current.nodeType === Node.TEXT_NODE) {
        if (current.textContent && current.textContent.length < offset - 1) {
          // its not this, lets deduct length of this from searched, and return null
          offset -= current.textContent.length
          console.log('text', current, offset)
          return { node: null, offset }
        } else {
          // It's this, lets return us and offset
          return { node: current, offset }
        }
      }
      let node: Node|null = null
      // We are not in text
      for (let lp = 0; lp < current.childNodes.length; lp++) {
        const { node: n, offset: o } = findCursorPosition(current.childNodes[lp], offset, parent)
        offset = o
        if (n) {
          node = n
          break
        }
      }
      console.log((current as Element).tagName)
      // if ((current as Element).tagName === 'DIV') offset--
      console.log('return', offset, node)
      return { node, offset }
    }

    function setCursorPosition (element: HTMLElement|null, charSelection: number[]) {
      window.setTimeout(() => {
        if (!element || charSelection.length !== 2) return
        if (charSelection[0] >= 0) {
          const selection = document.getSelection()
          const range = new Range()
          const { node, offset } = findCursorPosition(element, charSelection[0])
          if (selection && node) {
          // selection.extend(node, offset)
          // selection.collapse(node, offset)
            range.setStart(node, offset)
            range.setEnd(node, offset)
            selection.removeAllRanges()
            selection.addRange(range)
          }
        }
      }, 100)
    }

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
      const cursor = getCaretPosition(target)
      let html = target.innerHTML
      const r = new RegExp('/(?<!("|>))https?:\\/\\/[a-zA-Z.]*/', 'gmu')
      html = html.replace(r, (match, p1) => {
        console.log(match)
        return '<a href="' + p1 + '">' + p1 + '</a>'
      })
      target.innerHTML = html
      content.value = target.innerHTML
      // editorElement = event.target as HTMLElement
      console.log('...', cursor)
      setCursorPosition(event.target as HTMLElement, cursor)
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
