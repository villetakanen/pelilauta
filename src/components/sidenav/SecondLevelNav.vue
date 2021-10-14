<template>
  <nav id="secondLevelNav">
    <slot />
  </nav>
</template>

<style lang="sass" scoped>
@import @/styles/include-media.scss

@include media('>=tablet')
  nav#secondLevelNav
    position: absolute
    top: 0
    left: 0
    width: 310px
</style>
