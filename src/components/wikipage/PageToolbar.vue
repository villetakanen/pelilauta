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
      :to="`/mekanismi/edit/${site.siteid}/${page.id}`"
    >
      <img
        src="@/assets/icons/edit.svg"
        alt="edit icon"
      >
    </MaterialButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import { usePages, useSite } from '@/state/site'

export default defineComponent({
  name: 'PageToolbar',
  components: {
    MaterialButton
  },
  setup () {
    const { site } = useSite()
    const { page } = usePages()
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
