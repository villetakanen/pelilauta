<template>
  <div id="ScreenBottomFloatContainer">
    <div id="ScreenBottomFloatLeft" />
    <div id="ScreenBottomFloatRight" />
  </div>
</template>

<style lang="sass" scoped>
div.#ScreenBottomFloatContainer
  position: fixed
  bottom: 0
  left: 0
  width: 100vw
  height: auto
  box-sizing: border-box
  margin: 0
  padding: 16px
  z-index: 30000
</style>
