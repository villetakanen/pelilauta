<template>
  <div class="addPageView">
    <PageToolbar :title="$t('site.actions.addPage')" />
    <div class="singleColumnLayout">
      <AddPageForm />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useSite } from '@/state/site'
import AddPageForm from '@/components/page/AddPageForm.vue'
import PageToolbar from '@/components/page/PageToolbar.vue'

export default defineComponent({
  name: 'AddPageView',
  components: {
    AddPageForm,
    PageToolbar
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
