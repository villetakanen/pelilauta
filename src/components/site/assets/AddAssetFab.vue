<template>
  <Fab
    class="addAssetFab"
    color="tertiary"
    :disabled="uploading"
  >
    <input
      id="addAssetInput"
      ref="uploader"
      class="uploadButton"
      type="file"
      @change="addAsset"
    >
    <label for="addAssetInput">
      <Icon
        name="addAnImage"
        dark
      />
    </label>
  </Fab>
</template>

<script lang="ts">
import { useSnack } from '@/composables/useSnack'
import { useAuthState } from '@/state/authz'
import { uploadAsset } from '@/state/site/assets'
import { ComponentPublicInstance, defineComponent, onMounted, ref } from 'vue'
import Fab from '../../material/Fab.vue'
import Icon from '../../material/Icon.vue'

export default defineComponent({
  name: 'AddAssetView',
  components: { Fab, Icon },
  setup () {
    const uploader = ref<ComponentPublicInstance<HTMLInputElement>>()
    const uploading = ref(false)
    const { uid } = useAuthState()
    const { pushSnack } = useSnack()

    async function addAsset (e: Event) {
      const el = e.target as HTMLInputElement
      if (!el || !el.files || !el.files[0]) return
      uploading.value = true
      try {
        await uploadAsset(el.files[0], uid.value)
        pushSnack('upload ok')
      } catch (error) {
        console.error(error)
        pushSnack('upload error')
      }
      uploading.value = false
    }

    onMounted(() => {
      console.log(uploader.value)
    })

    return { uploader, addAsset }
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
  + label

</style>
