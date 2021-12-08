<template>
  <Header
    id="pageToolbar"
  >
    <ViewTitle
      :icon="site.system + '-logo'"
      :parent="site.name"
      :parent-route="`/site/${site.id}`"
    >
      {{ title }}
    </ViewTitle>
    <SpacerDiv />
    <ShareButton />
    <MaterialMenu v-model="menu" />
    <Dialog v-model="toggleDelete">
      <div>
        <h3>{{ $t('action.delete') }}</h3>
        <p>{{ $t('site.page.deleteWarning') }}</p>
        <Textfield
          id="threadBoxHeaderDeleteVerifyField"
          v-model="deleteConfirm"
          :label="$t('site.page.deleteConfirmLabel')"
        />
        <div class="toolbar">
          <div class="spacer" />
          <Button
            id="threadBoxHeaderDeleteVerifyButton"
            tertiary
            :disabled="deleteConfirm !== 'DELETE'"
            @click="deletePageFromFirestore"
          >
            {{ $t('action.delete') }}
          </Button>
          <Button @click="toggleDelete = false">
            {{ $t('action.cancel') }}
          </Button>
        </div>
      </div>
    </Dialog>
  </Header>
</template>

<script lang="ts">
import { useSite } from '@/state/site'
import { computed, defineComponent, ref } from 'vue'
import { useCopyLinkToClipboard } from '@/composables/useCopyURLToClipboard'
import MaterialMenu from '../material/MaterialMenu.vue'
import { MenuItem } from '@/utils/uiInterfaces'
import { useI18n } from 'vue-i18n'
import Dialog from '../material/Dialog.vue'
import Textfield from '../form/Textfield.vue'
import Button from '../form/Button.vue'
import { usePage } from '@/state/pages/usePage'
import { useUxActions } from '@/composables/useUxActions'
import Header from '../layout/Header.vue'
import ViewTitle from '../layout/ViewTitle.vue'
import SpacerDiv from '../layout/SpacerDiv.vue'
import ShareButton from '../actions/ShareButton.vue'

export default defineComponent({
  components: { MaterialMenu, Dialog, Textfield, Button, Header, ViewTitle, SpacerDiv, ShareButton },
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup () {
    const { site, hasAdmin } = useSite()
    const { deletePage } = usePage()
    const copyLink = useCopyLinkToClipboard()
    const i18n = useI18n()
    const { reroute } = useUxActions()

    const toggleDelete = ref(false)
    const deleteConfirm = ref('')

    function openDeleteDialog () {
      toggleDelete.value = true
    }

    async function deletePageFromFirestore () {
      if (deleteConfirm.value === 'DELETE') {
        await deletePage()
        reroute('/site/' + site.value.id)
      }
    }

    const menu = computed(() => {
      const menuItems = new Array<MenuItem>()
      if (hasAdmin()) {
        menuItems.push({
          text: i18n.t('action.delete'),
          icon: 'delete',
          action: openDeleteDialog
        })
      }
      return menuItems
    })

    return { site, copyLink, menu, toggleDelete, deleteConfirm, deletePageFromFirestore }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-typography.sass

#pageToolbar
  .title
    position: relative
    margin: 0
    padding: 0
    padding-left: 56px
    .badge
      position: absolute
      top: 0
      left: 0
  .siteTitle
    @include TypeCaption()
    a
      color: var(--chroma-secondary-d)
  .pageTitle
    @include TypeHeadline5()
    margin-top:0
    padding-top:0
    height: 1em
    white-space: nowrap
    padding-bottom: 8px
    margin-bottom: -8px
    max-width: calc(100vw - 70px)

@include media('>=tablet')
#pageToolbar
  .pageTitle
    max-width: auto
</style>
