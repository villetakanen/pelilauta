<template>
  <div id="siteInfo">
    <div class="relativeBox">
      <img
        class="icon"
        src="@/assets/icons/d12-black.svg"
        alt="D12 is the site secondary logo"
      >
      <h3>
        {{ $t('siteInfo.title') }}
      </h3>
      <h3>
        {{ version }} /
        {{ $t('app.lang') }}
      </h3>
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
  position: relative
  bottom: 0px
  left: 0px
  margin: 16px
  padding-top: 8px
  pointer-events: none
  h3
    @include TypeButton()
    color: $color-font-disabled
    margin-bottom: 8px
    padding-right: 60px

.icon
  @include SpacingIcon2()
  padding-left: 8px
  border-left: solid 1px $color-font-disabled
  position: absolute
  left: 100px
  top: 0
  height: 36px

</style>
