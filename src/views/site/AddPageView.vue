<template>
  <div class="addPageView">
    <SiteToolbar />
    <div class="">
      <h3>{{ $t('site.actions.addPage') }}</h3>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useSite } from '@/state/site'
import SiteToolbar from '@/components/sites/SiteToolbar.vue'

export default defineComponent({
  name: 'AddPageView',
  components: {
    SiteToolbar
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
