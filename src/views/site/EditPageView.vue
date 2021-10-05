<template>
  <div class="editPage">
    <PageToolbar :title="$t('site.page.edit')" />
    <div class="singleColumnLayout">
      <PageEditForm />
    </div>
  </div>
</template>

<script lang="ts">
import PageToolbar from '@/components/page/PageToolbar.vue'
import PageEditForm from '@/components/page/EditPageForm.vue'
import { usePage } from '@/state/pages/usePage'
import { useSite } from '@/state/site'
import { defineComponent, onMounted, watch } from 'vue'

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
    PageEditForm,
    PageToolbar
  },
  props: {
    siteid: {
      type: String,
      required: true
    },
    pageid: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup (props) {
    const { site } = useSite(props.siteid)
    const { page } = usePage(props.siteid, props.pageid)

    onMounted(() => {
      // Route changed, withoout unmounting of this item
      watch(props, (p) => {
        if (p.pageid !== page.value.id || p.siteid !== site.value.id) {
          useSite(props.siteid)
          usePage(props.siteid, props.pageid)
        }
      })
    })

    return { page, site }
  }
})
</script>
