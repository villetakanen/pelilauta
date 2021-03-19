<template>
  <teleport to="#ScreenBottomFloatRight">
    <div class="pageFabs">
      <Fab
        v-if="canEdit"
        color="tertiary"
        :to="`/mekanismi/attachments/${page.siteid}`"
      >
        <Icon
          name="mekanismi"
          color="dark"
        />
      </Fab>
      <Fab
        v-if="canEdit"
        id="wikipageCreatePageFab"
        color="secondary"
        :action="addPageDialog"
        :text="$t('action.create')"
      >
        <Icon
          name="add"
          color="dark"
        />
      </Fab>
      <Fab
        v-if="canEdit"
        id="wikipageEditPageFab"
        :text="$t('action.edit')"
        :to="`/mekanismi/edit/${page.siteid}/${page.id}`"
      >
        <Icon
          name="edit"
        />
      </Fab>
      <Dialog v-model="dialog">
        <AddPageCard />
      </Dialog>
    </div>
  </teleport>
</template>

<script lang="ts">
import { useAuthState } from '@/state/authz'
import { Page, useSite } from '@/state/site'
import { computed, ComputedRef, defineComponent, inject, ref } from 'vue'
import Dialog from '../material/Dialog.vue'
import Fab from '../material/Fab.vue'
import Icon from '../material/Icon.vue'
import AddPageCard from './AddPageCard.vue'

export default defineComponent({
  name: 'PageFabs',
  components: {
    Fab,
    Icon,
    Dialog,
    AddPageCard
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
