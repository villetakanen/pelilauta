<template>
  <div class="threadEditor">
    <div class="threadHeader toolbar">
      <TextField
        size="headline"
        :label="$t('thread.title')"
      />
      <MaterialSelect />
    </div>

    <div class="editor">
      <QuillEditor
        v-model="threadContent"
        toolbar
      />
    </div>
    threadEditor

    <div class="debugBox contentArea">
      <p>mode: '{{ mode }}'</p>
      <p>topic: '{{ topic }}'</p>
      <div>{{ thread }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Thread } from '@/state/threads/threads'
import { computed, defineComponent, PropType } from 'vue'
import MaterialSelect from '../material/MaterialSelect.vue'
import TextField from '../material/TextField.vue'
import QuillEditor from '../quill/QuillEditor.vue'

/**
 * A Router view for a Stream Thread in an edit mode.
 *
 * Loads all the required State entities, and initiates the required Firebase
 * subscriptions.
 * Does not contain any functionality aside from state management and component
 * import/layout
 */
export default defineComponent({
  name: 'ViewThread',
  components: {
    TextField,
    MaterialSelect,
    QuillEditor
  },
  props: {
    thread: {
      type: Object as PropType<Thread>,
      required: true
    },
    mode: {
      type: String,
      required: false,
      default: ''
    },
    topic: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup (props) {
    const threadContent = computed(() => (props.thread.data.content))
    return { threadContent }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass

.editor
  border: solid 1px var(--color-fill-primary)
.threadHeader
  div+div
    margin-left: 8px
</style>
