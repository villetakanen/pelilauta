<template>
  <ToolBarAction
    icon="add-link"
    class="toolbarLinkAction"
  >
    <div
      v-if="open"
      class="linkOptions"
    >
      <TextField
        v-model="formTitle"
        :label="$t('editor.link.title')"
      />
      <TextField
        v-model="formURL"
        :label="$t('editor.link.url')"
      />
      <div class="toolbar">
        <div class="spacer" />
        <MaterialButton>
          {{ $t('action.save') }}
        </MaterialButton>
      </div>
    </div>
  </ToolBarAction>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import MaterialButton from '../material/MaterialButton.vue'
import TextField from '../material/TextField.vue'
import ToolBarAction from '../material/ToolBarAction.vue'

export default defineComponent({
  components: { ToolBarAction, TextField, MaterialButton },
  props: {
    open: {
      type: Boolean,
      required: false,
      default: false
    },
    title: {
      type: String,
      required: false,
      default: ''
    },
    url: {
      type: String,
      required: false,
      default: ''
    }
  },
  emits: ['update:title', 'update:url'],
  setup (props, context) {
    const rawTitle = ref('')
    const formTitle = computed({
      get: () => (rawTitle.value ?? props.title),
      set: (value: string) => {
        rawTitle.value = value
        context.emit('update:title', value)
      }
    })
    const rawURL = ref('')
    const formURL = computed({
      get: () => (rawURL.value ?? props.url),
      set: (value: string) => {
        const url = new URL(value).toString()
        rawTitle.value = url
        context.emit('update:title', url)
      }
    })
    return { formTitle, formURL }
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
