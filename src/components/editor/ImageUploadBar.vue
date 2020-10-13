<template>
  <div class="image-upload-toolbar">
    <div
      v-for="(image, index) in images"
      :key="image.url"
      class="image-preview"
      :class="{ selected: index === focus}"
      @click="focus=index"
    >
      <img :src="image.url">
    </div>
    <div class="image-add">
      ...
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
// import * as firebase from 'firebase/app'
// import 'firebase/storage'
// import { setCaret, getCaretOffset } from './caret'

export default defineComponent({
  props: {
    modelValue: {
      type: Array,
      required: false,
      default: new Array<string>()
    },
    selected: {
      type: Number,
      required: false,
      default: -1
    }
  },
  emits: ['update:modelValue', 'update:selected'],
  setup (props, context) {
    const images = ref(props.modelValue.map((val) => { return { url: val, uploading: false } }))
    const focus = ref(props.selected)

    watch(images, (value) => context.emit('update:modelValue', value))
    watch(focus, (value) => context.emit('update:selected', value))

    return { images, focus }
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
</style>
