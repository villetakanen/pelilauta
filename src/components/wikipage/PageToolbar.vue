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
    <MaterialMenu v-model="menu" />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, computed, ComputedRef, ref } from 'vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import { Page, Site } from '@/state/site'
import { copyUrl } from '@/utils/window'
import { MenuItem } from '@/lib/meta'
import MaterialMenu from '@/components/material/MaterialMenu.vue'

export default defineComponent({
  name: 'PageToolbar',
  components: {
    MaterialButton,
    MaterialMenu
  },
  setup () {
    const site = inject('site') as ComputedRef<Site>
    const page = inject('page') as ComputedRef<Page>

    function _copyUrl () {
      copyUrl('/mekanismi/view/' + site.value.id + '/' + page.value.id)
    }

    const menu = computed(() => {
      const arr = new Array<MenuItem>()
      arr.push({ action: _copyUrl, text: 'Copy link', icon: 'link' })
      arr.push({ to: '/mekanismi/siteinfo/' + site.value.id, text: 'Site info', icon: 'site' })
      return arr
    })

    return { site, page, menu }
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
