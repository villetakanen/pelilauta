<template>
  <Dialog v-model="showDialog">
    <div>
      <h1>INJECT IMAGE MVP</h1>
      <div class="selector">
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
      <MaterialButton @click="inject">
        {{ $t('action.add') }}
      </MaterialButton>
    </div>
  </Dialog>
</template>
<script lang="ts">
import { IMAGE_TAG_INSERT_EVENT, IMAGE_UPLOAD_EVENT } from '@/composables/useQuill/imageModule'
import { useAssets } from '@/state/authz'
import { defineComponent, onMounted, ref } from 'vue'
import Dialog from '../material/Dialog.vue'
import MaterialButton from '../material/MaterialButton.vue'

export default defineComponent({
  name: 'InserMediaDialog',
  components: { Dialog, MaterialButton },
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
