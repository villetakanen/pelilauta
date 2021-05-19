<template>
  <div
    class="addAssetFab fab"
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
        class="fabIcon"
        name="addAnImage"
        dark
      />
    </label>
  </div>
</template>

<script lang="ts">
import { useSnack } from '@/composables/useSnack'
import { useAuthState } from '@/state/authz'
import { uploadAsset } from '@/state/site/assets'
import { ComponentPublicInstance, defineComponent, onMounted, ref } from 'vue'
import Icon from '../../material/Icon.vue'

export default defineComponent({
  name: 'AddAssetView',
  components: { Icon },
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
.fabIcon
  height: 48px
  width: 48px

.fab
  @include Rise2()
  background-color: var(--chroma-secondary-d)
  height: 56px
  width: 56px
  margin: 0
  padding: 0
  border-radius: 28px
  border: none
  background-position: center
  transition: 0.3s
  line-height: 48px

</style>
