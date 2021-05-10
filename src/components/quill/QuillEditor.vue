<template>
  <div
    v-once
    id="editor"
    class="richText"
    :innerHTML="modelValue"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from 'vue'
import Quill from 'quill'
import QuillBetterTable from 'quill-better-table'
import firebase from 'firebase/app'
import 'firebase/storage'

export default defineComponent({
  name: 'QuillEditor',
  props: {
    modelValue: { type: String, required: false, default: '' },
    toolbar: { type: Boolean, required: false, default: false },
    storage: { type: String, required: false, default: '' }
  },
  emits: ['update:modelValue', 'new-images'],
  setup (props, context) {
    onMounted(() => {
      console.debug('Quill editor injected, starting to add Quill', props.toolbar)
      const imageHandler = () => {
        console.debug('imageHandler')
        const input = document.createElement('input')

        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')
        input.click()

        input.onchange = async () => {
          console.debug('event triggered!')
          const file = input.files ? input.files[0] : null
          if (!file || !props.storage) {
            throw Error('Missing file or storage path')
          }

          // Save current cursor state
          const range = quill.getSelection(true)

          // Insert temporary loading placeholder image
          quill.insertEmbed(range.index, 'image', `${window.location.origin}/src/loading-image.svg`)

          // Move cursor to right side of image (easier to continue typing)
          quill.setSelection(range.index + 1, 1)

          const storageRef = firebase.storage().ref()
          const fileRef = storageRef.child(`/${props.storage}/${file.name}`)

          const snapshot = await fileRef.put(file)
          console.debug('snapshot:', snapshot)
          const url = await snapshot.ref.getDownloadURL()
          console.debug('url:', url)

          // Remove placeholder image
          quill.deleteText(range.index, 1)

          // Insert uploaded image
          quill.insertEmbed(range.index, 'image', url)
        }
      }
      const toolbarOptions = {
        container: [
          { header: [1, 2, 3, 4, false] },
          'bold', 'italic', 'underline', 'strike', // toggled buttons
          'blockquote', 'code-block',
          'link',
          { list: 'ordered' },
          { list: 'bullet' },
          'align',
          'table',
          'image',
          'clean'
        ],
        handlers: {
          table: function () {
            const tableModule = quill.getModule('better-table')
            tableModule.insertTable(3, 3)
          }
        }
      }
      const options = {
        theme: props.toolbar ? 'snow' : undefined,
        scrollingContainer: '#editor',
        modules: {}
      }
      if (props.toolbar) {
        options.modules = {
          toolbar: toolbarOptions,
          table: false, // disable table module
          'better-table': {
            operationMenu: {
              items: {
                unmergeCells: {
                  text: 'Another unmerge cells name'
                }
              }
            }
          },
          keyboard: {
            bindings: QuillBetterTable.keyboardBindings
          }
        }
      }
      Quill.register({
        'modules/better-table': QuillBetterTable
      }, true)
      const quill = new Quill('#editor', options)
      const toolbar = quill.getModule('toolbar')
      toolbar.addHandler('image', imageHandler)
      quill.on('text-change', () => {
        context.emit('update:modelValue', quill.root.innerHTML)
      })
      watch(() => props.modelValue, (val) => {
        if (quill.root.innerHTML === val) return
        quill.root.innerHTML = val
      })
    })
  }
})
</script>

<style lang="sass">
@import @/styles/material-typography.sass

#editor
  max-height: calc(100vh - 268px)
  overflow: scroll
  .ql-editor
    padding: 8px

</style>
