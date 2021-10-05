<template>
  <div class="addPageView">
    <Toolbar>
      <h3>{{ $t('action.addSite') }}</h3>
    </Toolbar>
    <div class="singleColumnLayout">
      <AddSiteForm />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AddSiteForm from '@/components/site/AddSiteForm.vue'

export default defineComponent({
  name: 'AddPageView',
  components: {
    AddSiteForm
  }
})
</script>
