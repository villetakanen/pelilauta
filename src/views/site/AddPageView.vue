<template>
  <div class="addPageView">
    <SiteToolbar />
    <div class="singleColumnLayout">
      <AddPageForm />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useSite } from '@/state/site'
import SiteToolbar from '@/components/sites/SiteToolbar.vue'
import AddPageForm from '@/components/site/AddPageForm.vue'

export default defineComponent({
  name: 'AddPageView',
  components: {
    SiteToolbar,
    AddPageForm
  },
  props: {
    siteid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { site } = useSite(props.siteid)
    return { site }
  }
})
</script>
