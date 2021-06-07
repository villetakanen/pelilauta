<template>
  <div class="threadEditorView singleColumnLayout">
    <ThreadEditForm
      :threadid="threadid"
      :site="site"
    />
  </div>
</template>

<script lang="ts">
import ThreadEditForm from '@/components/thread/ThreadEditForm.vue'
import { useSite } from '@/state/site'
import { defineComponent } from 'vue'

/**
 * View component for the Tread Editor
 *
 * Initializes all the required route entities and loads the custom rich-text-parchment based Quill.
 *
 * @TODO: refactor view at @/views/pelilauta/EditThread.vue to this view
 */
export default defineComponent({
  name: 'ThreadEditorView',
  components: {
    ThreadEditForm
  },
  props: {
    threadid: {
      type: String,
      required: false,
      default: ''
    },
    siteid: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup (props) {
    console.debug(props.siteid)
    const { site } = props.siteid ? useSite(props.siteid) : { site: null }
    return { site }
  }
})
</script>

<style lang="sass" scoped>

</style>
