<template>
  <div class="editSiteThreadView ">
    <SiteToolbar />
    <div class="singleColumnLayout">
      <SiteThreadEditor
        :threadid="threadid"
        :topic="topic"
      />
    </div>
  </div>
</template>

<script lang="ts">
import SiteThreadEditor from '@/components/site/threads/SiteThreadEditor.vue'
import SiteToolbar from '@/components/site/SiteToolbar.vue'
import { defineComponent } from 'vue'

/**
 * A Router view for editing or adding a new thread to stream(s)
 *
 * Does not contain any functionality aside from shared state initialization
 * and layout
 */
export default defineComponent({
  name: 'EditSiteThreadView',
  components: {
    SiteThreadEditor,
    SiteToolbar
  },
  props: {
    threadid: {
      type: String,
      required: false,
      default: ''
    },
    topic: {
      type: String,
      required: false,
      default: 'Yleinen'
    },
    siteid: {
      type: String,
      required: false,
      default: 'mekanismi'
    }
  }
})
</script>
