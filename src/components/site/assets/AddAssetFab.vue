<template>
  <div
    class="addAssetFab"
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
        headline
      />
    </label>
  </div>
</template>

<script lang="ts">
import { useSnack } from '@/composables/useSnack'
import { useAuth } from '@/state/authz'
import { uploadAsset } from '@/state/site/assets'
import { ComponentPublicInstance, defineComponent, ref } from 'vue'
import Icon from '../../material/Icon.vue'

export default defineComponent({
  name: 'AddAssetView',
  components: { Icon },
  setup () {
    const uploader = ref<ComponentPublicInstance<HTMLInputElement>>()
    const uploading = ref(false)
    const { user } = useAuth()
    const { pushSnack } = useSnack()

    async function addAsset (e: Event) {
      const el = e.target as HTMLInputElement
      if (!el || !el.files || !el.files[0]) return
      uploading.value = true
      try {
        await uploadAsset(el.files[0], user.value.uid)
        pushSnack('upload ok')
      } catch (error) {
        console.error(error)
        pushSnack('upload error')
      }
      uploading.value = false
    }

    return { uploader, addAsset }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/box-shadow.sass

[type="file"]
  border: 0
  clip: rect(0, 0, 0, 0)
  height: 1px
  overflow: hidden
  padding: 0
  position: absolute !important
  white-space: nowrap
  width: 1px

.addAssetFab
  background-color: var(--chroma-secondary-d)
  height: 44px
  width: 44px
  margin: 2px
  padding: 0px
  border-radius: 28px
  border: none
  background-position: center
  transition: 0.3s
  line-height: 48px
  position: relative

</style>
