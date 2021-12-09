<template>
  <Column class="SiteThemeTool">
    <h1 class="title">
      {{ $t('site.themetool.title') }}
    </h1>
  </Column>
</template>

<script lang="ts">
import Column from '@/components/layout/Column.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: { Column },
  setup () {

  }
})
</script>
