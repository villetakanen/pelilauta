<template>
  <Dialog v-model="showDialog">
    <div>
      <Toolbar>
        <h3>{{ $t('action.add') }}</h3>
        <SpacerDiv />
        <UploadAssetButton />
      </Toolbar>
      <div
        class="selector"
        style="min-width:310px"
      >
        <div
          v-for="asset in assets"
          :key="asset[0]"
          class="selectable"
          :class="{ selected: selected === asset[0] }"
          @click="selected = asset[0]"
        >
          <img
            class="preview"
            :src="asset[1].url"
            :alt="asset[1].name"
          >
        </div>
      </div>
    </div>
    <template #footer>
      <Toolbar>
        <SpacerDiv />
        <Button @click="inject">
          {{ $t('action.add') }}
        </Button>
      </Toolbar>
    </template>
  </Dialog>
</template>
<script lang="ts">
import { IMAGE_UPLOAD_EVENT } from '@/utils/quill/imageModule'
import { useAssets } from '@/state/assets'
import { defineComponent, onMounted, ref } from 'vue'
import Button from '../form/Button.vue'
import SpacerDiv from '../layout/SpacerDiv.vue'
import Toolbar from '../layout/Toolbar.vue'
import Dialog from '../material/Dialog.vue'
import UploadAssetButton from '../assets/UploadAssetButton.vue'

export default defineComponent({
  name: 'InserMediaDialog',
  components: { Dialog, Toolbar, Button, SpacerDiv, UploadAssetButton },
  emits: ['addImage'],
  setup (props, context) {
    const showDialog = ref(false)
    const selected = ref('')

    const { assets } = useAssets()

    onMounted(() => {
      document.addEventListener(IMAGE_UPLOAD_EVENT, () => {
        console.debug('InserMediaDialog got', IMAGE_UPLOAD_EVENT)
        showDialog.value = true
      })
    })

    function inject () {
      context.emit('addImage', {
        url: assets.value.get(selected.value)?.url || '-',
        alt: assets.value.get(selected.value)?.name || '-'
      })
      showDialog.value = false
    }

    return { showDialog, inject, assets, selected }
  }
})
</script>

<style lang="sass" scoped>
div.selector
  display: flex
  flex-wrap: wrap
  div.selectable
    height: 64px
    width: 64px
    padding: 4px
    &:hover
      background-color: var(--color-b-h)
    &.selected
      background-color: var(--color-b-i)
    img.preview
      max-height: 64px
      max-width: 64px
</style>
