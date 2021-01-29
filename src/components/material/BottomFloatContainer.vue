<template>
  <div id="ScreenBottomFloatContainer">
    <div id="ScreenBottomFloatLeft">
      <slot name="left" />
    </div>
    <div id="ScreenBottomFloatRight">
      <slot name="right" />
    </div>
  </div>
</template>

<style lang="sass" scoped>
@import @/styles/include-media.scss

div#ScreenBottomFloatContainer
  position: fixed
  bottom: 0
  left: 0
  width: 100vw
  height: auto
  box-sizing: border-box
  margin: 0
  padding: 16px
  z-index: 30000
  div#ScreenBottomFloatRight
    text-align: right

@include media('<tablet')
  div#ScreenBottomFloatLeft
    padding-bottom: 16px

@include media('>=tablet')
  div#ScreenBottomFloatContainer
    display: flex
    flex-wrap: nowrap
    justify-content: space-between
    align-items: flex-end

</style>
