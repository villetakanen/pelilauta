<template>
  <MaterialButton
    icon
    :disabled="uploading"
  >
    <input
      id="fileUpload"
      ref="uploader"
      type="file"
      @change="addAsset"
    >
    <label
      for="fileUpload"
      class="uploader"
    >
      <Icon name="addAnImage" />
    </label>
  </MaterialButton>
</template>

<script lang="ts">
import { ComponentPublicInstance, defineComponent, ref } from 'vue'
import Icon from '@/components/material/Icon.vue'
import MaterialButton from '../material/MaterialButton.vue'
import { useSnack } from '@/composables/useSnack'
import { useAssets } from '@/state/assets'
import { processAsset } from '@/composables/useAssetTools'

export default defineComponent({
  components: { Icon, MaterialButton },
  emits: ['uploaded'],
  setup (props, context) {
    const uploader = ref<ComponentPublicInstance<HTMLInputElement>>()
    const uploading = ref(false)
    const { pushSnack } = useSnack()
    const { uploadAsset } = useAssets()

    async function addAsset (e: Event) {
      uploading.value = true
      try {
        const uploadData = await processAsset(e)
        const asset = await uploadAsset(uploadData.name, uploadData.mimetype, uploadData.dataURL)
        context.emit('uploaded', asset.url?.href)
        pushSnack('upload ok')
      } catch (error) {
        console.error(error)
        pushSnack('upload error')
      }
      uploading.value = false
    }
    return { uploading, uploader, addAsset }
  }
})
</script>

<style lang="sass" scoped>
[type="file"]
  border: 0
  clip: rect(0, 0, 0, 0)
  height: 1px
  overflow: hidden
  padding: 0
  position: absolute !important
  white-space: nowrap
  width: 1px

</style>
