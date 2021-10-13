<template>
  <Dialog v-model="open">
    <Textfield />
  </Dialog>
</template>

<script lang="ts">
import { useAssets } from '@/state/assets'
import { computed, defineComponent } from 'vue'
import Textfield from '../form/Textfield.vue'
import Dialog from '../material/Dialog.vue'

export default defineComponent({
  components: { Dialog, Textfield },
  props: {
    site: {
      type: String,
      required: false,
      default: ''
    },
    modelValue: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    const { uploadAsset } = useAssets()
    const open = computed({
      get: () => props.modelValue,
      set: (value: boolean) => {
        context.emit('update:modelValue', value)
      }
    })
    return { open }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-typography.sass

</style>
