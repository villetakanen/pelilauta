<template>
  <div class="threadEditForm">
    <div class="toolbar">
      <Icon
        v-if="site && site.systemBadge"
        :name="site.systemBadge"
        medium
      />
      <div class="spacer">
        <p class="topics">
          <span v-if="site">{{ site.name }}</span>
        </p>
        <TextField :label="$t('thread.title')" />
      </div>
    </div>
    <DocumentEditor v-if="!threadid || thread.data.content" />
  </div>
</template>

<script lang="ts">
import { Site } from '@/state/site'
import { defineComponent, PropType } from 'vue'
import DocumentEditor from '../editor/DocumentEditor.vue'
import Icon from '../material/Icon.vue'
import TextField from '../material/TextField.vue'

export default defineComponent({
  name: 'ThreadEditForm',
  components: {
    DocumentEditor,
    TextField,
    Icon
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
  setup (props) {
    console.debug(props.site)
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass

.topics
  @include TypeCaption()
</style>
