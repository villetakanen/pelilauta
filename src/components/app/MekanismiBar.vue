<template>
  <div
    v-if="site && site.id && !mobileViewport"
    id="mekanismiBar"
    class="toolbar"
  >
    <router-link :to="`/mekanismi/view/${site.id}/${site.id}`">
      {{ site.name }}
    </router-link>
    <div v-if="page && page.id">
      &nbsp;/&nbsp;
      <router-link :to="`/mekanismi/view/${site.id}/${page.id}`">
        {{ page.name }}
      </router-link>
    </div>
    <div class="spacer" />
    <router-link :to="`/mekanismi/siteinfo/${site.id}/`">
      {{ $t('mekanismi.siteinfo') }}
    </router-link>
  </div>
</template>

<script lang="ts">
import { Page, Site } from '@/state/site'
import { defineComponent, inject, ComputedRef } from 'vue'

export default defineComponent({
  setup () {
    const site = inject('site') as ComputedRef<Site>
    const page = inject('page') as ComputedRef<Page>
    const mobileViewport = inject('mobileViewport') as ComputedRef<boolean>
    return { site, page, mobileViewport }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

#mekanismiBar
  @include TypeButton()
  position: relative
  margin-top: -16px
  height: 24px
  padding: 4px 8px
  background-color: $color-fill-tertiary
  line-height: 22px
  display: flex
  color: #ccc
  a
    color: white
    text-decoration: none
#mekanismiBarSpacer
  height: 20px
</style>
