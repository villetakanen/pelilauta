<template>
  <nav
    id="NavigationRail"
    class="hideOnMobile"
  >
    <div class="appLogo">
      <img src="@/assets/icons/dark/fox.svg">
    </div>
  </nav>
</template>

<style lang="sass" scoped>
#NavigationRail
  background: linear-gradient(-42deg, var(--chroma-secondary-a) 0%, var(--chroma-secondary-b) 100%)
  position: fixed
  width: 80px
  height: 100vh
  z-index: 10000
  .appLogo
    margin: 12px
    padding: 0
    width: calc(80px - 2 * 12px)
    height: calc(80px - 2 * 12px)
    &:hover
     filter: drop-shadow(0px 0px 7px rgba(255,255,255,0.22))
</style>
