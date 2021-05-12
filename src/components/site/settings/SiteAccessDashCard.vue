<template>
  <Card>
    <!--h1 class="title">
      {{ $t('site.settings.access.title') }}
    </h1-->
    <SitePlayerAccess :site="site" />
  </Card>
</template>

<script lang="ts">
import Card from '@/components/layout/Card.vue'
import { Site } from '@/state/site'
import { defineComponent, PropType } from 'vue'
import SitePlayerAccess from './SitePlayerAccess.vue'

export default defineComponent({
  components: { Card, SitePlayerAccess },
  props: {
    site: {
      type: Object as PropType<Site>,
      required: false,
      default: 1
    }
  }
})
</script>
