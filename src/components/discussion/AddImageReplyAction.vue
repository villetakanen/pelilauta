<template>
  <MaterialButton icon>
    <input
      ref="uploader"
      type="file"
      :disabled="uploading"
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

export default defineComponent({
  components: { Icon, MaterialButton },
  emits: ['imageUploaded'],
  setup (props, context) {
    const uploader = ref<ComponentPublicInstance<HTMLInputElement>>()
    const uploading = ref(false)
    const { pushSnack } = useSnack()

    async function addAsset (e: Event) {
      const el = e.target as HTMLInputElement
      if (!el || !el.files || !el.files[0]) return
      uploading.value = true
      try {
        // await uploadAsset(el.files[0], uid.value)
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
