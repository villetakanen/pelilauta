<template>
  <Dialog
    v-model="open"
    class="uploadAssetDialog"
  >
    <div
      ref="previewPane"
      class="previewPane contentBox"
    />
    <div v-if="previewImageUrl">
      <Textfield
        v-model="assetName"
        :label="$t('assets.file.name')"
      />
      <Button>-- Upload the File to Assets --</Button>
    </div>
    <label
      v-else
      class="fileUploadButton"
    >
      <input
        type="file"
        @change="preProcessImage"
      >
      -- Select File --
    </label>
  </Dialog>
</template>

<script lang="ts">
import downscale from 'downscale'
import { ComponentPublicInstance, computed, defineComponent, ref, Ref } from 'vue'
import Button from '../form/Button.vue'
import Textfield from '../form/Textfield.vue'
import Dialog from '../material/Dialog.vue'

const DOWNSCLASED_MIMETYPES = [
  'image/jpeg',
  'image/png'
]

export default defineComponent({
  components: { Dialog, Textfield, Button },
  props: {
    site: {
      type: String,
      required: false,
      default: ''
    },
    modelValue: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    const previewImageUrl:Ref<string> = ref('')
    const assetName = ref('')
    const previewPane = ref<ComponentPublicInstance<HTMLInputElement>>()
    const open = computed({
      get: () => props.modelValue,
      set: (value: boolean) => {
        previewImageUrl.value = ''
        context.emit('update:modelValue', value)
      }
    })

    async function preProcessImage (e: Event) {
      console.log('preProcessImage', e)
      const element = (e.target as HTMLInputElement)
      if (element.files && element.files[0]) {
        const file = element.files[0]
        assetName.value = file.name
        console.debug('file type is:', file.type)
        if (DOWNSCLASED_MIMETYPES.includes(file.type)) {
          const imageURI = await downscale(element.files[0], 512, 512)
          previewImageUrl.value = imageURI
          console.log('imageURI', imageURI)
        } else {
          const assetURI = URL.createObjectURL(element.files[0])
          previewImageUrl.value = assetURI
          console.log('imageURI', assetURI)
        }
      }
      if (previewPane.value) {
        const img = document.createElement('img')
        img.src = previewImageUrl.value
        previewPane.value.appendChild(img)
      }
    }

    return { open, previewImageUrl, preProcessImage, previewPane, assetName }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-typography.sass
@import @/styles/box-shadow.sass

div.previewPane
  width: min(310px, calc(100vw - 64px))
  height: min(310px, calc(100vw - 64px))
  border: solid 1px var(--chroma-secondary-g)
  margin-bottom: 24px
  background-color: var(--chroma-secondary-i)
  position: relative

input[type="file"]
  display: none

.fileUploadButton
  @include TypeButton()
  @include Rise2()
  background-color: var(--chroma-secondary-d)
  color: var(--chroma-secondary-i)
  border: none
  height: 24px
  margin: 5px
  padding: 6px 18px
  border-radius: 19px
  display: block
  transition-property: box-shadow background
  transition-duration: 0.3s
  position: relative
  overflow: visible
  &:hover
    background-color: var(--chroma-secondary-e)
  &:active
    background-color: var(--chroma-secondary-c)
    @include Rise1()
</style>
