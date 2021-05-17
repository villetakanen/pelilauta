<template>
  <div class="siteOwnersTool">
    <h1 class="title">
      {{ $t('site.settings.access.ownersToolTitle') }}
    </h1>
    <p class="tooltip">
      {{ $t('site.settings.access.ownersTooltip') }}
    </p>
    <div class="ownerChips">
      <OwnerChip
        v-for="o in site.owners"
        :key="o"
        :uid="o"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Site } from '@/state/site'
import { defineComponent, PropType } from 'vue'
import OwnerChip from './OwnerChip.vue'

export default defineComponent({
  components: { OwnerChip },
  props: {
    site: {
      type: Object as PropType<Site>,
      required: false,
      default: 1
    }
  },
  setup () {
  }
})
</script>
