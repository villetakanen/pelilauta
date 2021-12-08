<template>
  <div class="siteListToolbar">
    <Header>
      <ViewTitle icon="mekanismi">
        {{ $t('sites.title') }}
      </ViewTitle>
    </Header>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Header from '../layout/Header.vue'
import ViewTitle from '../layout/ViewTitle.vue'

export default defineComponent({
  name: 'SiteListToolbar',
  components: { Header, ViewTitle }
})
</script>
