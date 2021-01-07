<template>
  <div class="toolbar">
    <div>
      <h1 class="subtitle">
        {{ site.name }}
      </h1>
      <h1>{{ page.name }}</h1>
    </div>
    <div class="spacer" />
    <MaterialButton
      icon
      color="tertiary"
    >
      <img
        src="@/assets/icons/share.svg"
        alt="share icon"
      >
    </MaterialButton>
    <MaterialButton
      icon
      color="tertiary"
      :to="`/mekanismi/edit/${site.id}/${page.id}`"
    >
      <img
        src="@/assets/icons/edit.svg"
        alt="edit icon"
      >
    </MaterialButton>
    <MaterialMenu v-model="menu" />
    <Dialog v-model="dialog">
      <MaterialCard>
        <h1>Add a new page</h1>
        <input
          type="text"
          class="material-textfield"
        >
        <br>
        <br>
        <MaterialButton>Add page</MaterialButton>
      </MaterialCard>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, computed, ComputedRef, ref } from 'vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import { Page, Site } from '@/state/site'
import { copyUrl } from '@/utils/window'
import { MenuItem } from '@/lib/meta'
import MaterialMenu from '@/components/material/MaterialMenu.vue'
import Dialog from '../material/Dialog.vue'
import MaterialCard from '../material/MaterialCard.vue'

export default defineComponent({
  name: 'PageToolbar',
  components: {
    MaterialButton,
    MaterialMenu,
    Dialog,
    MaterialCard
  },
  setup () {
    const site = inject('site') as ComputedRef<Site>
    const page = inject('page') as ComputedRef<Page>
    const dialog = ref(false)

    function _copyUrl () {
      copyUrl('/mekanismi/view/' + site.value.id + '/' + page.value.id)
    }

    function _addPageDialog () {
      console.log('adding a page is not implemented yet')
      dialog.value = true
    }

    const menu = computed(() => {
      const arr = new Array<MenuItem>()
      arr.push({ action: _copyUrl, text: 'Copy link', icon: 'link' })
      arr.push({ action: _addPageDialog, text: 'Create new wikipage', icon: 'new' })
      arr.push({ to: '/mekanismi/siteinfo/' + site.value.id, text: 'Site info', icon: 'site' })
      return arr
    })

    return { site, page, menu, dialog }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass
@import @/styles/layout.sass
@import @/styles/include-media.scss

.toolbar
  margin-bottom: 8px
  h1
    @include TypeButton()
    font-size: 22px
    line-height: 32px
    color: $color-fill-primary-dark
    &.subtitle
      @include TypeButton()
      font-size: 12px
      line-height: 16px
</style>
