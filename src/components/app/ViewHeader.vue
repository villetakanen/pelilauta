<template>
  <h1 class="viewHeader">
    <slot />
  </h1>
</template>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

@include media('>phone')
  h1.viewHeader
    @include TypeDisplay1()
    opacity: 0.37
</style>
