<template>
  <Toolbar
    id="pageToolbar"
  >
    <div class="title">
      <Icon
        :name="site.systemBadge + '-logo'"
        headline
        class="badge"
      />
      <h3 class="siteTitle clipWithEllipsis">
        <router-link
          :to="`/site/${site.id}`"
        >
          {{ site.name }}
        </router-link>
      </h3>
      <h3 class="pageTitle clipWithEllipsis">
        {{ title }}
      </h3>
    </div>
    <div class="spacer" />
    <Action
      prepend="share"
      @click="copyLink"
    >
      <span class="onlyForDesktop">{{ $t('action.share') }}</span>
    </Action>
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
  </Toolbar>
</template>

<script lang="ts">
import { useSite } from '@/state/site'
import { computed, defineComponent, ref } from 'vue'
import { useCopyLinkToClipboard } from '@/composables/useCopyURLToClipboard'
import Toolbar from '../layout/Toolbar.vue'
import Action from '../material/Action.vue'
import Icon from '../material/Icon.vue'
import MaterialMenu from '../material/MaterialMenu.vue'
import { MenuItem } from '@/utils/uiInterfaces'
import { useI18n } from 'vue-i18n'
import Dialog from '../material/Dialog.vue'
import Textfield from '../form/Textfield.vue'
import Button from '../form/Button.vue'

export default defineComponent({
  components: { Toolbar, Action, Icon, MaterialMenu, Dialog, Textfield, Button },
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup () {
    const { site, hasAdmin } = useSite()
    const copyLink = useCopyLinkToClipboard()
    const i18n = useI18n()

    const toggleDelete = ref(false)
    const deleteConfirm = ref('')

    function openDeleteDialog () {
      toggleDelete.value = true
    }

    function deletePageFromFirestore () {

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
