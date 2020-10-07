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
  <div class="imagePreviews">
    <img
      v-for="url in images.split(';')"
      :key="url"
      :src="url"
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
// import { setCaret, getCaretOffset } from './caret'

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      required: false,
      default: ''
    },
    images: {
      type: String,
      required: false,
      default: ''
    }
  },
  emits: ['update:modelValue', 'update:images'],
  setup (props, context) {
    const content = ref(props.modelValue)
    const minedImages = ref(props.images)

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

    const patternStart = '(<div>|<br>| |^|&nbsp;)'
    const patternEnd = '(&nbsp;| |<div>|</div>|<br>|$)'

    function mineLinks (update: string) {
      // let im = ''
      const r = new RegExp(patternStart + '(https?:\\/\\/[a-zA-Z0-9#:\\/_\\.-]*\\.(jpg|png|gif|svg|jpeg))' + patternEnd, 'gmu')
      const linksMatch = update.matchAll(r)
      let result = linksMatch.next()
      while (!result.done) {
        if (result.value && !minedImages.value.includes(result.value[2])) {
          minedImages.value += result.value[2] + ';'
        }
        result = linksMatch.next()
      }
      // minedImages.value = im
      if (minedImages.value.endsWith(';')) minedImages.value = minedImages.value.substring(0, minedImages.value.length - 1)
    }

    /**
     * Some of the message processing is tedious, or migth be impossible to implement to
     * editor directly --> do it here instead.
     */
    function postProcessContent (update: string) {
      mineLinks(update)
      // Add links not found by editor (at the end of a line, at the beginning of a line)
      // @TODO: some of these might be findable by editor, like 'http://a\/n' f.ex.
      // const r = new RegExp('/(?<!("|>))https?:\\/\\/[a-zA-Z.]*/', 'gmu')
      const r = new RegExp(patternStart + '(https?:\\/\\/[a-zA-Z0-9#:\\/_\\.-]*)' + patternEnd, 'gmu')
      update = update.replace(r, (match, p1, p2, p3) => {
        return `${p1}<a href="${p2.trim()}">${p2.trim()}</a>${p3}`
      })
      content.value = update
    }

    // let cursor = [0, 0]
    // let editorElement: HTMLElement|null = null

    function onInput (event: Event) {
      const target = event.target as HTMLElement
      postProcessContent(target.innerHTML)

      // this is current caret offset from the start of the element
      // at the time of @event
      // const offset = getCaretOffset(target)

      // let html = target.innerHTML
      // const r = new RegExp('/(?<!("|>))https?:\\/\\/[a-zA-Z.]*/', 'gmu')
      // const r = new RegExp('( |&nbsp;)(https?:\\/\\/[a-zA-Z\\/_.-]*)( |&nbsp;)', 'gmu')
      // html = html.replace(r, (match, p1, p2, p3) => {
      //  return `${p1}<a href="${p2}">${p2}</a>${p3}`
      // })
      // target.innerHTML = html
      // content.value = target.innerHTML

      // we need to return caret to the offset after setting
      // innerHTML
      // setCaret(event.target as HTMLElement, offset)
    }

    watch(content, (value) => {
      context.emit('update:modelValue', value)
    })
    watch(minedImages, (value) => {
      // console.log('emitting', value)
      context.emit('update:images', value)
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
  padding: 8px
  overflow-x: scroll
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

.imagePreviews
  display: flex
  width: 100%
  img
    max-width: 44px
    max-height: 44px

</style>
