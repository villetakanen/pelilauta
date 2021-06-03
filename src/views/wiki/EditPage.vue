<template>
  <div class="editPage">
    <SiteToolbar />
    <div class="contentGrid">
      <PageEditor
        :page="page"
        :site="site"
      />
    </div>
  </div>
</template>

<script lang="ts">
import SiteToolbar from '@/components/sites/SiteToolbar.vue'
import PageEditor from '@/components/wikipage/PageEditor.vue'
import { fetchPage, usePages, useSite } from '@/state/site'
import { defineComponent } from 'vue'

/**
 * A Router view for a Wiki Page in an edit mode.
 *
 * Loads all the required State entities, and initiates the required Firebase
 * subscriptions.
 *
 * Does not contain any functionality aside from state management and component
 * import/layout
 */
export default defineComponent({
  name: 'EditPage',
  components: {
    PageEditor,
    SiteToolbar
  },
  props: {
    siteid: {
      type: String,
      required: true
    },
    pageid: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup (props) {
    const { site } = useSite(props.siteid)
    fetchPage(props.pageid || props.siteid)
    const { page } = usePages()
    return { site, page }
  }
})
</script>
