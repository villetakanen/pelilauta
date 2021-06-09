<template>
  <div class="toolbarLinkAction">
    <ToolBarAction
      icon="add-link"
      @click="$emit('update:modelValue', true)"
    />
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
        <MaterialButton @click="cancel">
          {{ $t('action.cancel') }}
        </MaterialButton>
        <MaterialButton @click="save">
          {{ $t('action.save') }}
        </MaterialButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
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
  emits: ['update:url', 'update:modelValue', 'urlAdded'],
  setup (props, context) {
    const formURL = ref('')
    onMounted(() => {
      watch(() => props.url, (value) => {
        formURL.value = value
      },
      { immediate: true })
    })

    function cancel () {
      context.emit('update:modelValue', false)
      context.emit('update:url', '')
    }

    function save () {
      const url = new URL(formURL.value).toString()
      context.emit('update:modelValue', false)
      context.emit('update:url', url)
      context.emit('urlAdded', url)
    }

    return { formURL, cancel, save }
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
