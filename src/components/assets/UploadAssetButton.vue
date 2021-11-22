<template>
  <label
    class="UploadAssetButton"
    :class="{ uploading: uploading, active: active }"
  >
    <input
      type="file"
      @click="onFileClick"
      @change="onFileChange"
    >
    <Icon
      name="addAnImage"
      class="buttonIcon"
      small
      dark
    />
    <span class="label">{{ $t('action.addAttachment') }}</span>
    <div class="worker">
      <img
        alt="uploading"
        class="uploadingInteraction"
        src="@/assets/animations/puff.svg"
      >
    </div>
  </label>
</template>

<script lang="ts">
import { useSnack } from '@/composables/useSnack'
import { useAssets } from '@/state/assets'
import { processAsset } from '@/composables/useAssetTools'
import { defineComponent, ref } from 'vue'
import Icon from '../material/Icon.vue'
import { useI18n } from 'vue-i18n'
import { logError } from '@/utils/eventLogger'

export default defineComponent({
  components: { Icon },
  emits: ['uploaded'],
  setup (props, context) {
    const uploading = ref(false)
    const active = ref(false)
    const { pushSnack } = useSnack()
    const { uploadAsset } = useAssets()
    const i18n = useI18n()

    function onFileClick () {
      active.value = true
      setTimeout(() => { active.value = false }, 1000)
    }

    async function onFileChange (e: Event) {
      uploading.value = true

      try {
        const uploadData = await processAsset(e)
        const asset = await uploadAsset(uploadData.name, uploadData.mimetype, uploadData.dataURL)
        context.emit('uploaded', asset.url?.href)
        pushSnack(i18n.t('asset.uploadDialog.success'))
      } catch (error) {
        logError(error)
        pushSnack('upload error')
      }

      uploading.value = false
    }

    return { active, uploading, onFileClick, onFileChange }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/box-shadow.sass

.UploadAssetButton
  position: relative
  background: none
  background-color: var(--chroma-secondary-d)
  border: none
  height: 40px
  width: auto
  margin: 4px
  padding: 8px
  box-sizing: border-box
  border-radius: 20px
  @include Rise2()
  transition: 0.3s
  overflow: hidden
  .label
    padding: 0 8px
    color: var(--chroma-secondary-i)
  &:hover
    background-color: var(--chroma-secondary-e)
    @include Rise1()
  &.disabled
    background-color: var(--chroma-secondary-a)
    opacity: 0.11
  .uploading-image
    opacity: 0
    position: absolute
    left: -2px
    top: -2px
    pointer-events: none
  &.active, &.uploading
    background-color: var(--chroma-secondary-c)
    @include Rise0()
    .buttonIcon, .label
      opacity: 0.7
    .worker
      opacity: 1

input[type="file"]
  display: none

div.worker
  position: absolute
  left: calc(50% - 24px)
  top: -4px
  opacity: 0
  transition-property: opacity
  transition-duration: 0.3s

</style>
