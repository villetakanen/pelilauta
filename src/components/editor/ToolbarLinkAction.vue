<template>
  <ToolBarAction
    icon="add-link"
    class="toolbarLinkAction"
  >
    <div
      v-if="modelValue"
      class="linkOptions"
    >
      <TextField
        v-model="formURL"
        :label="$t('editor.link.url')"
      />
      <div class="toolbar">
        <div class="spacer" />
        <MaterialButton @click="$emit('update:modelValue', false)">
          {{ $t('action.cancel') }}
        </MaterialButton>
        <MaterialButton @click="pushUrl">
          {{ $t('action.save') }}
        </MaterialButton>
      </div>
    </div>
  </ToolBarAction>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import MaterialButton from '../material/MaterialButton.vue'
import TextField from '../material/TextField.vue'
import ToolBarAction from '../material/ToolBarAction.vue'

export default defineComponent({
  components: { ToolBarAction, TextField, MaterialButton },
  props: {
    modelValue: {
      type: Boolean,
      required: false,
      default: false
    },
    url: {
      type: String,
      required: false,
      default: ''
    }
  },
  emits: ['seturl', 'update:modelValue'],
  setup (props, context) {
    const formURL = ref('')
    function pushUrl () {
      context.emit('update:modelValue', false)
      const url = new URL(formURL.value).toString()
      context.emit('seturl', url)
    }

    return { formURL, pushUrl }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/box-shadow.sass

.toolbarLinkAction
  position: relative
  .linkOptions
    position: absolute
    background-color: var(--chroma-clear)
    @include Rise1()
    z-index: 100
    top: 32px
    right: 0
    padding: 16px
    min-width: 300px

</style>
