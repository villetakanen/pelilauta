<template>
  <Dialog v-model="showDialog">
    <div>
      <h1>{{ $t('action.add') }}</h1>
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
import { IMAGE_TAG_INSERT_EVENT, IMAGE_UPLOAD_EVENT } from '@/composables/useQuill/imageModule'
import { useAssets } from '@/state/assets'
import { defineComponent, onMounted, ref } from 'vue'
import Button from '../form/Button.vue'
import SpacerDiv from '../layout/SpacerDiv.vue'
import Toolbar from '../layout/Toolbar.vue'
import Dialog from '../material/Dialog.vue'

export default defineComponent({
  name: 'InserMediaDialog',
  components: { Dialog, Toolbar, Button, SpacerDiv },
  setup () {
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
      console.debug('inject()')
      document.dispatchEvent(new CustomEvent(IMAGE_TAG_INSERT_EVENT, {
        detail: {
          url: assets.value.get(selected.value)?.url || '-',
          alt: assets.value.get(selected.value)?.name || '-'
        }
      }))
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
