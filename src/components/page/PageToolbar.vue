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
    <Button
      v-if="site.usePlayers"
      class="hideOnMobile"
      text
      @click="reroute('/site/' + site.id + '/keeper')"
    >
      <Icon
        name="keeper"
        small
      />
      <span class="onlyForDesktop">{{ $t('keeper.title') }}</span>
    </Button>
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
    <MovePageDialog v-model="movePageDialog" />
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
import { useAuth } from '@/state/authz'
import Icon from '../material/Icon.vue'
import MovePageDialog from './MovePageDialog.vue'

export default defineComponent({
  components: { MaterialMenu, Dialog, Textfield, Button, Header, ViewTitle, SpacerDiv, ShareButton, Icon, MovePageDialog },
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup () {
    const { site } = useSite()
    const { deletePage } = usePage()
    const copyLink = useCopyLinkToClipboard()
    const i18n = useI18n()
    const { reroute } = useUxActions()
    const { user } = useAuth()

    const toggleDelete = ref(false)
    const deleteConfirm = ref('')

    const movePageDialog = ref(false)

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
      if (site.value.hasEditor(user.value.uid)) {
        menuItems.push({
          text: i18n.t('action.move'),
          icon: 'move',
          action: () => {
            movePageDialog.value = true
          }
        })
        menuItems.push({
          text: i18n.t('action.delete'),
          icon: 'delete',
          action: openDeleteDialog
        })
      }
      menuItems.push({
        text: '---'
      })
      if (site.value.usePlayers) {
        menuItems.push({
          text: i18n.t('site.keeper.title'),
          icon: 'keeper',
          to: '/site/' + site.value.id + '/keeper'
        })
      }
      if (site.value.hasOwner(user.value.uid)) {
        menuItems.push({
          text: i18n.t('site.meta.title'),
          icon: 'equalizer',
          to: '/site/' + site.value.id + '/meta'
        })
        menuItems.push({
          text: i18n.t('site.settings.title'),
          icon: 'settings',
          to: '/site/' + site.value.id + '/settings'
        })
      }
      return menuItems
    })

    return { site, copyLink, menu, toggleDelete, deleteConfirm, deletePageFromFirestore, reroute, movePageDialog }
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
