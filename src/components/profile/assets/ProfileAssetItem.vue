<template>
  <Card class="assetListItem">
    <img
      v-if="imageAsset"
      class="imagePreview"
      :alt="asset.name"
      :src="asset.url"
    >
    <p class="info clipWithEllipsis">
      {{ asset.name }}
    </p>
    <Button
      class="deletebutton"
      @click="drop()"
    >
      {{ $t('action.delete') }}
    </Button>
  </Card>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { toDisplayString } from '@/utils/firebaseTools'
import Card from '@/components/layout/Card.vue'
import { Asset, useAssets } from '@/state/assets'
import { useI18n } from 'vue-i18n'
import { useSnack } from '@/composables/useSnack'
import Button from '@/components/form/Button.vue'

const IMAGE_MIMETYPES = [
  'image/jpeg',
  'image/png',
  'image/svg'
]

export default defineComponent({
  name: 'AttachmentRow',
  components: {
    Card,
    Button
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const i18n = useI18n()
    const { pushSnack } = useSnack()
    const { assets, deleteAsset } = useAssets()
    const asset = computed(() => (assets.value.get(props.id) || new Asset()))
    const imageAsset = computed(() => (IMAGE_MIMETYPES.includes(asset.value.mimetype)))

    async function drop () {
      try {
        await deleteAsset(props.id)
        pushSnack(i18n.t('asset.delete.success'))
      } catch (error) {
        console.error(error)
        pushSnack(i18n.t('asset.delete.failure'))
      }
      console.log('not refactored yet!')
    }

    return { toDisplayString, drop, asset, imageAsset }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-typography.sass

.assetListItem
  width: calc(100vw - 32px)
  overflow: hidden
  position: relative
  .imagePreview
    pointer-events: none
    margin: -16px
    max-width: calc(100% + 32px)
  .info
    @include TypeBody2()
    position: absolute
    bottom: 0
    left: 0
    padding: 16px
    background: linear-gradient(37deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.7) 100%)
    width: calc(100% - 32px)
    height: 24px
    white-space: nowrap
  .deletebutton
    position: absolute
    right: 16px
    top: 16px

@include media('>=tablet')
  .assetListItem
    width: 256px
    height: 256px

</style>
