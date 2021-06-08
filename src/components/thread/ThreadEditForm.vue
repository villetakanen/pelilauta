<template>
  <div class="threadEditForm">
    <div class="threadHeader toolbar">
      <TextField
        v-model="v.threadTitle.$model"
        header
        :label="$t('threads.title')"
        :error="v.threadTitle.$error"
      />
    </div>
    <DocumentEditor v-if="!threadid || thread.data.content" />
  </div>
</template>

<script lang="ts">
import { Site } from '@/state/site'
import useVuelidate from '@vuelidate/core'
import { defineComponent, onMounted, PropType, ref } from 'vue'
import { required } from '@vuelidate/validators'
import DocumentEditor from '../editor/DocumentEditor.vue'
import TextField from '../material/TextField.vue'

export default defineComponent({
  name: 'ThreadEditForm',
  components: {
    DocumentEditor,
    TextField
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

    const v = useVuelidate({
      threadTitle: { required }
    }, { threadTitle })

    return { v }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass

.topics
  @include TypeCaption()
</style>
