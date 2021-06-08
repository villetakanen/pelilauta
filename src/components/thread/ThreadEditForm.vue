<template>
  <div class="threadEditForm">
    <div class="editorHeader toolbar">
      <TextField
        v-model="v.threadTitle.$model"
        class="field"
        header
        :label="$t('threads.title')"
        :error="v.threadTitle.$error"
      />
      <MaterialSelect
        v-model="v.threadTopic.$model"
        class="field"
        :opts="topicOpts"
        :label="$t('threads.topic')"
      />
      <ToolBarAction
        icon="equalizer"
      />
    </div>
    <DocumentEditor v-if="!threadid || thread.data.content" />
  </div>
</template>

<script lang="ts">
import { Site } from '@/state/site'
import useVuelidate from '@vuelidate/core'
import { defineComponent, PropType, ref } from 'vue'
import { required } from '@vuelidate/validators'
import DocumentEditor from '../editor/DocumentEditor.vue'
import TextField from '../material/TextField.vue'
import MaterialSelect from '../material/MaterialSelect.vue'
import ToolBarAction from '../material/ToolBarAction.vue'

export default defineComponent({
  name: 'ThreadEditForm',
  components: {
    DocumentEditor,
    TextField,
    MaterialSelect,
    ToolBarAction
  },
  props: {
    threadid: {
      type: String,
      required: false,
      default: ''
    },
    site: {
      type: Object as PropType<Site|null>,
      required: false,
      default: () => null
    }
  },
  setup () {
    // Thread name
    const threadTitle = ref('')
    const threadTopic = ref('')

    const v = useVuelidate({
      threadTitle: { required },
      threadTopic: { required }
    }, { threadTitle, threadTopic })

    return { v }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass

.topics
  @include TypeCaption()
.editorHeader
  margin-bottom: 8px
  div
    margin: 0
  div+div
    margin: 0 8px
</style>
