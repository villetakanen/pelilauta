<template>
  <div>
    <div class="imageUploader">
      <input
        id="fileUpload"
        class="uploadButton"
        type="file"
        @change="uploadImage"
      >
      <label
        for="fileUpload"
        class="uploader"
      >
        <img
          v-if="!uploading"
          src="@/assets/icons/dark/addPhoto.svg"
          alt="add an image"
          class="label"
        >
        <Loader
          v-if="uploading"
          class="label"
        />
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import firebase from 'firebase/app'
import 'firebase/storage'
import Loader from '../app/Loader.vue'
import { useSnack } from '@/composables/useSnack/useSnack'

export default defineComponent({
  name: 'ImageUploader',
  components: { Loader },
  props: {
    target: {
      type: String,
      required: true
    }
  },
  emits: ['imageUploaded'],
  setup (props, context) {
    const uploading = ref(false)

    function uploadImage (e: Event) {
      if (!e.target || !props.target) return
      const element = e.target as HTMLInputElement
      uploading.value = true
      if (element.files && element.files[0]) {
        const file = element.files[0]
        const storageRef = firebase.storage().ref()
        const fileRef = storageRef.child(props.target + '/' + file.name)
        fileRef.put(file).then((snapshot) => {
          snapshot.ref.getDownloadURL().then((url) => {
            uploading.value = false
            context.emit('imageUploaded', url)
            const { pushSnack } = useSnack()
            pushSnack({ topic: 'File uploaded', message: 'The semi permanent storage url is ' + url })
          })
        })
      }
    }

    return { uploading, uploadImage }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass
@import @/styles/include-media.scss

[type="file"]
  border: 0
  clip: rect(0, 0, 0, 0)
  height: 1px
  overflow: hidden
  padding: 0
  position: absolute !important
  white-space: nowrap
  width: 1px

.imageUploader
  background: rgba($color-fill-primary-dark, 0.22)
  background: linear-gradient(177deg, rgba($color-fill-primary-dark, 0.22) 0%, rgba($color-fill-primary, 0.22) 100%)
  position: relative
  width: 100%
  margin: 0
  margin-bottom: 48px
  .uploader
    img.label
      width: 90%
      padding: 5%
      opacity: 0.8

</style>
