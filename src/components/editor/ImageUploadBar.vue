<template>
  <div class="image-upload-toolbar">
    <div
      v-for="(image) in images"
      :key="image"
      class="image-preview"
    >
      <img :src="image">
    </div>
    <div class="image-add">
      <input
        id="file"
        class="toolbar-action"
        type="file"
        @change="uploadImage"
      >
      <label for="file">
        <img src="@/assets/add-photo-action.svg">
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import * as firebase from 'firebase/app'
import 'firebase/storage'
// import { setCaret, getCaretOffset } from './caret'

export default defineComponent({
  props: {
    modelValue: {
      type: Array,
      required: false,
      default: new Array<string>()
    }
  },
  emits: ['update:modelValue', 'update:selected'],
  setup (props, context) {
    const images = ref(props.modelValue as Array<string>)

    watch(images, (value) => context.emit('update:modelValue', value))

    function uploadImage (e: Event) {
      if (!e.target) return
      const element = e.target as HTMLInputElement
      if (element.files && element.files[0]) {
        const file = element.files[0]
        const storageRef = firebase.storage().ref()
        const fileRef = storageRef.child('/stream/uploads/' + new Date().getTime() + file.name)
        fileRef.put(file).then((snapshot) => {
          snapshot.ref.getDownloadURL().then((url) => {
            images.value.push(url)
          })
        })
      }
    }

    return { images, focus, uploadImage }
  }
})
</script>

<style lang="sass">
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass
@import @/styles/layout.sass

.image-preview
  height: 48px
  width: 48px
  vertical-align: middle
  display: inline-block
  background-color: $color-secondary-light
  margin-right: 4px
  line-height: 48px
  img
    max-width: 44px
    max-height: 44px
    margin: 2px
    vertical-align: middle
    display: inline-block
.image-add
  height: 48px
  width: 48px
  vertical-align: middle
  display: inline-block

[type="file"]
  border: 0
  clip: rect(0, 0, 0, 0)
  height: 1px
  overflow: hidden
  padding: 0
  position: absolute !important
  white-space: nowrap
  width: 1px

  + label
    // File upload button styles
    opacity: 0.5
    img
      height: 44px
      width: 44px
      margin: 2px
      vertical-align: middle
      display: inline-block

  &:focus + label,
  + label:hover
    // File upload hover state button styles
    opacity: 0.8

  &:focus + label
    // File upload focus state button styles
    opacity: 1
</style>
