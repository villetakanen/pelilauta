<template>
  <div class="addPageView">
    <Header>
      <ViewTitle icon="add">
        {{ $t('action.addSite') }}
      </ViewTitle>
    </Header>
    <div class="singleColumnLayout">
      <AddSiteForm />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AddSiteForm from '@/components/site/AddSiteForm.vue'
import Header from '@/components/layout/Header.vue'
import ViewTitle from '@/components/layout/ViewTitle.vue'

export default defineComponent({
  name: 'AddPageView',
  components: {
    AddSiteForm,
    Header,
    ViewTitle
  }
})
</script>
