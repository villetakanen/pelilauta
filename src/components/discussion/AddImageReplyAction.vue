<template>
  <div
    class="AddImageReplyAction"
    :class="{
      disabled: disabled,
      uploading: uploading,
      active: active }"
    @click="active=true"
  >
    <label class="fileUploadButton">
      <input
        ref="uploader"
        type="file"
        @click="setActive"
        @change="addAsset"
      >
      <Icon
        name="addAnImage"
        small
        dark
      />
    </label>
    <img
      alt="uploading"
      class="uploading-image"
      src="@/assets/animations/puff.svg"
    >
  </div>
</template>

<script lang="ts">
import { ComponentPublicInstance, defineComponent, ref } from 'vue'
import Icon from '@/components/material/Icon.vue'
import { useSnack } from '@/composables/useSnack'
import { useAssets } from '@/state/assets'
import { processAsset } from '@/composables/useAssetTools'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  components: { Icon },
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['uploaded'],
  setup (props, context) {
    const uploader = ref<ComponentPublicInstance<HTMLInputElement>>()
    const uploading = ref(false)
    const active = ref(false)
    const { pushSnack } = useSnack()
    const { uploadAsset } = useAssets()
    const i18n = useI18n()

    async function addAsset (e: Event) {
      if (props.disabled) return
      uploading.value = true
      try {
        const uploadData = await processAsset(e)
        const asset = await uploadAsset(uploadData.name, uploadData.mimetype, uploadData.dataURL)
        context.emit('uploaded', asset.url?.href)
        pushSnack(i18n.t('asset.uploadDialog.success'))
      } catch (error) {
        console.error(error)
        pushSnack('upload error')
      }
      uploading.value = false
    }

    function setActive () {
      active.value = true
      setTimeout(() => { active.value = false }, 300)
    }

    return { uploading, uploader, addAsset, active, setActive }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/box-shadow.sass

.AddImageReplyAction
  background: none
  background-color: var(--chroma-primary-d)
  border: none
  height: 40px
  width: 40px
  margin: 0
  padding: 8px
  box-sizing: border-box
  border-radius: 12px
  @include Rise2()
  transition: 0.3s
  &:hover
    background-color: var(--chroma-primary-a)
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
  &.uploading
    [type="file"], label
      opacity: 0
    .uploading-image
      opacity: 1
  &.active, &.uploading
    background-color: var(--chroma-secondary-d)
    @include Rise0()

input[type="file"]
  display: none

</style>
