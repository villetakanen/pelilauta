<template>
  <Dialog
    v-model="open"
    :label="$t('asset.uploadDialog.title')"
    class="uploadAssetDialog"
  >
    <div
      ref="previewPane"
      class="previewPane contentBox"
    />
    <div v-if="previewImageUrl">
      <div
        v-if="showResizeWarning"
        class="warning"
      >
        {{ $t('asset.uploadDialog.resized') }}
      </div>
      <Textfield
        v-model="assetName"
        :label="$t('asset.uploadDialog.filename')"
      />
    </div>
    <template
      #footer
    >
      <Toolbar v-if="previewImageUrl">
        <SpacerDiv />
        <Button
          text
          @click="open=false"
        >
          {{ $t('action.cancel') }}
        </Button>
        <Button @action="upload()">
          {{ $t('asset.uploadDialog.uploadFile') }}
        </Button>
      </Toolbar>
      <Toolbar v-else>
        <label
          class="fileUploadButton"
        >
          <input
            type="file"
            @change="preProcessImage"
          >
          {{ $t('asset.uploadDialog.selectFile') }}
        </label>
      </Toolbar>
    </template>
  </Dialog>
</template>

<script lang="ts">
import { useSnack } from '@/composables/useSnack'
import { useAssets } from '@/state/assets'
import downscale from 'downscale'
import { ComponentPublicInstance, computed, defineComponent, ref, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '../form/Button.vue'
import Textfield from '../form/Textfield.vue'
import SpacerDiv from '../layout/SpacerDiv.vue'
import Dialog from '../material/Dialog.vue'
import Toolbar from '@/components/layout/Toolbar.vue'

const DOWNSCLASED_MIMETYPES = [
  'image/jpeg',
  'image/png'
]

export default defineComponent({
  components: { Dialog, Textfield, Button, SpacerDiv, Toolbar },
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
    const { uploadAsset } = useAssets()
    const { pushSnack } = useSnack()
    const i18n = useI18n()
    const previewImageUrl:Ref<string> = ref('')
    const assetName = ref('')
    const assetMimeType = ref('')
    const previewPane = ref<ComponentPublicInstance<HTMLInputElement>>()
    const showResizeWarning = ref(false)
    const working = ref(false)
    const open = computed({
      get: () => props.modelValue,
      set: (value: boolean) => {
        previewImageUrl.value = ''
        assetName.value = ''
        context.emit('update:modelValue', value)
      }
    })

    async function preProcessImage (e: Event) {
      console.log('preProcessImage', e)
      const element = (e.target as HTMLInputElement)
      if (element.files && element.files[0]) {
        const file = element.files[0]
        assetName.value = file.name
        assetMimeType.value = file.type
        console.debug('file type is:', file.type)
        if (DOWNSCLASED_MIMETYPES.includes(file.type)) {
          const imageURI = await downscale(element.files[0], 720, 720)
          previewImageUrl.value = imageURI
          showResizeWarning.value = true
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

    async function upload () {
      working.value = true
      await uploadAsset(assetName.value, assetMimeType.value, previewImageUrl.value)
      working.value = false
      pushSnack(i18n.t('asset.uploadDialog.success'))
      open.value = false
    }

    return { open, previewImageUrl, preProcessImage, previewPane, assetName, showResizeWarning, upload }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-typography.sass
@import @/styles/box-shadow.sass

.warning
  margin: 0
  margin-bottom: 8px

div.previewPane
  width: min(310px, calc(100vw - 64px))
  height: min(310px, calc(100vw - 64px))
  border: solid 1px var(--chroma-secondary-g)
  margin-bottom: 8px
  background-color: var(--chroma-secondary-i)
  position: relative
  text-align: center

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
