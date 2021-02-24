<template>
  <div class="editPage contentGrid">
    <MaterialCard>
      ...
    </MaterialCard>
  </div>
</template>

<script lang="ts">
import MaterialCard from '@/components/material/MaterialCard.vue'
import { usePages, useSite } from '@/state/site'
import { defineComponent } from 'vue'

/**
 * A Router view for a Wiki Page in an edit mode.
 *
 * Loads all the required State entities, and initiates the required Firebase
 * subscriptions.
 *
 * Does not contain any functionality aside from state management and component
 * import/layout
 */
export default defineComponent({
  name: 'EditPage',
  components: {
    MaterialCard
  },
  props: {
    siteid: {
      type: String,
      required: true
    },
    pageid: {
      type: String,
      required: true
    }
  },
  setup () {
    const { site } = useSite()
    const { page } = usePages()
    return { site, page }
  }
})
</script>
