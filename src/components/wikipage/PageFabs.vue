<template>
  <teleport to="#ScreenBottomFabsContainer">
    <div class="pageFabs">
      <Fab
        v-if="canEdit"
        id="pageFabsCreateThread"
        secondary
        :to="`/site/${page.siteid}/add/thread`"
        :text="$t('action.addThread')"
        icon="addDiscussion"
      />
      <Fab
        v-if="canEdit"
        id="wikipageCreatePageFab"
        secondary
        :to="`/site/${page.siteid}/add/page`"
        :text="$t('action.addPage')"
        icon="add"
      />
      <Fab
        v-if="canEdit"
        id="wikipageEditPageFab"
        :text="$t('action.edit')"
        :to="`/site/${page.siteid}/page/${page.id}/edit`"
        icon="edit"
      />
    </div>
  </teleport>
</template>

<script lang="ts">
import { useAuthState } from '@/state/authz'
import { Page, useSite } from '@/state/site'
import { computed, ComputedRef, defineComponent, inject, ref } from 'vue'
import Fab from '../material/Fab.vue'

export default defineComponent({
  name: 'PageFabs',
  components: {
    Fab
  },
  setup () {
    const page = inject('page') as ComputedRef<Page>
    const dialog = ref(false)
    function addPageDialog () {
      dialog.value = true
    }
    const canEdit = computed(() => {
      const { hasAdmin } = useSite()
      const { uid } = useAuthState()
      return hasAdmin(uid.value)
    })

    return { page, dialog, addPageDialog, canEdit }
  }
})
</script>
