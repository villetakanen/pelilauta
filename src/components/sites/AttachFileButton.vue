<template>
  <div>
    <MaterialButton
      color="secondary"
      :disabled="!canEdit"
      @click="attachDialog = true"
    >
      {{ $t('action.addAttachment') }}
    </MaterialButton>
    <Dialog v-model="attachDialog">
      <MaterialCard class="dialogCard">
        <h1>Skeleton for file upload card</h1>
        <ImageUploader
          :target="`/${site.id}`"
          @imageUploaded="attachDialog = false"
        />
        <div class="toolbar pushBottom">
          <div class="spacer" />
          <MaterialButton>{{ $t('action.cancel') }}</MaterialButton>
          <MaterialButton>{{ $t('action.save') }}</MaterialButton>
        </div>
      </MaterialCard>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { useAuthState } from '@/state/authz'
import { Site, useSite } from '@/state/site'
import { computed, ComputedRef, defineComponent, inject, ref } from 'vue'
import ImageUploader from '../images/ImageUploader.vue'
import Dialog from '../material/Dialog.vue'
import MaterialButton from '../material/MaterialButton.vue'
import MaterialCard from '../material/MaterialCard.vue'

export default defineComponent({
  name: 'AttachFileButton',
  components: {
    MaterialButton,
    Dialog,
    MaterialCard,
    ImageUploader
  },
  setup () {
    const attachDialog = ref(false)
    const canEdit = computed(() => {
      const { uid } = useAuthState()
      const { hasAdmin } = useSite()
      return hasAdmin(uid.value)
    })
    const site = inject('site') as ComputedRef<Site>
    return { attachDialog, canEdit, site }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass
@import @/styles/layout.sass
@import @/styles/include-media.scss

.dialogCard
  min-height: 400px
  min-width: 400px
  position: relative
  .pushBottom
    position: absolute
    bottom: 16px
    left: 16px
    width: 400px

@include media('<tablet')
  .dialogCard
    position: relative
    height: calc(100vh - 66px)
    width: calc(100vw - 66px)
    min-height: calc(100vh - 66px)
    min-width: calc(100vw - 66px)
    .pushBottom
      position: absolute
      bottom: 16px
      right: 16px
</style>
