<template>
  <div class="toolbar wikiPageToolbar">
    <div>
      <h1 v-if="page.name">
        {{ page.name }}
      </h1>
      <h1 v-else>
        {{ site.name }}
      </h1>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ComputedRef } from 'vue'
import { Page, Site } from '@/state/site'

export default defineComponent({
  name: 'PageToolbar',
  setup () {
    const site = inject('site') as ComputedRef<Site>
    const page = inject('page') as ComputedRef<Page>

    return { site, page }
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
  padding: 0
  h1
    @include TypeButton()
    font-size: 22px
    line-height: 32px
    color: $color-fill-primary-dark

@include media('<tablet')
  .wikiPageToolbar
    margin-bottom: 0
    padding-bottom: 0
    h1.subtitle
      padding: 8px 0
      padding-bottom: 0
    h1
      padding: 8px 0
      padding-top: 0
</style>
