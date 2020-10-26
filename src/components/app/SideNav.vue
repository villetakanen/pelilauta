<template>
  <div class="menu-action">
    <img src="@/assets/icons/menu-burger.svg">
  </div>
  <div class="menu">
    <h1>Menu goes here</h1>
  </div>
</template>

<style lang="sass" scoped>
.menu-action
  height: 56px
  padding:8px 0
  img
    height: 40px
    width: 40px
    &:active
     transform: scale(.95)
.menu
  display: none
</style>
