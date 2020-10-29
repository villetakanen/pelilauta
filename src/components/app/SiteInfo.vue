<template>
  <div id="siteInfo">
    <div class="relativeBox">
      <img
        class="icon"
        src="@/assets/icons/d12-black.svg"
      >
      <h3>
        {{ $t('siteInfo.title') }} –
        {{ version }} –
        {{ $t('lang') }}
      </h3>
      <p>
        {{ $t('siteInfo.text') }}
      </p>
      <p>
        <router-link to="/about">
          {{ $t('action.readMore') }}
        </router-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { version } from '@/../package.json'

export default defineComponent({
  name: 'SiteInfo',
  setup () {
    return { version }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/layout.sass
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

#siteInfo
  position: absolute
  bottom: 0px
  left: 0px
  margin: 16px
  padding-top: 8px
  border-top: solid 1px $color-font-disabled
  h3
    @include TypeButton()
    color: $color-font-disabled
    margin-bottom: 8px
  p
    @include TypeCaption()
    color: $color-font-disabled
    margin-right: 74px
    margin-bottom: 8px

.relativeBox
  position: relative
  width: 276px

.icon
  @include SpacingIcon2X()
  padding-left: 8px
  border-left: solid 1px $color-font-disabled
  position: absolute
  right: 0
  top: 0

</style>
