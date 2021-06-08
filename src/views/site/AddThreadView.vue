<template>
  <div class="addThreadView">
    <SiteToolbar :title="$t('action.addThread')" />
    <div class="singleColumnLayout">
      <ThreadEditForm
        :site="site"
      />
    </div>
  </div>
</template>

<script lang="ts">
import SiteToolbar from '@/components/sites/SiteToolbar.vue'
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
    ThreadEditForm,
    SiteToolbar
  },
  props: {
    siteid: {
      type: String,
      required: true,
      default: ''
    }
  },
  setup (props) {
    const { site } = props.siteid ? useSite(props.siteid) : { site: null }
    return { site }
  }
})
</script>

<style lang="sass" scoped>

</style>
