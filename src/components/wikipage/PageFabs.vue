<template>
  <teleport to="body">
    <div class="pageFabs">
      <Fab
        v-if="canEdit"
        color="tertiary"
        :to="`/mekanismi/attachments/${page.siteid}`"
        :text="$t('action.site')"
      >
        <Icon
          name="site"
          color="dark"
        />
      </Fab>
      <Fab
        v-if="canEdit"
        color="secondary"
        :action="_addPageDialog"
        :text="$t('action.create')"
      >
        <Icon
          name="add"
          color="dark"
        />
      </Fab>
      <Fab
        v-if="canEdit"
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
    function _addPageDialog () {
      dialog.value = true
    }
    const canEdit = computed(() => {
      const { hasAdmin } = useSite()
      const { uid } = useAuthState()
      console.log(uid.value, hasAdmin(uid.value))
      return hasAdmin(uid.value)
    })

    return { page, dialog, _addPageDialog, canEdit }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass
@import @/styles/layout.sass
@import @/styles/include-media.scss

@include media('>tablet')
  .pageFabs
    position: fixed
    position: fixed
    bottom: 16px
    right: 16px
    z-index: 20000
    display: block
    .materialFab
      @include BoxShadow8()
    button+button
      margin-left: 16px

@include media('<=tablet')
  .pageFabs
    position: fixed
    bottom: 16px
    left: 50%
    transform: translateX(-50%)
    z-index: 20000
    display: block
    width: 200px
    .materialFab
      @include BoxShadow8()
    button+button
      margin-left: 16px

</style>
