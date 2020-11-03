<template>
  <div class="material-card">
    <slot />
  </div>
</template>

<style lang="sass">
@import @/styles/material-colors.sass
@import @/styles/layout.sass
@import @/styles/material-typography.sass
@import @/styles/include-media.scss

div.material-card
  @include TypeColorDark()
  @include SpacingContainer()
  background-color: white
  // @include BoxShadow1()
  // border-radius: 4px
  .title
    margin-bottom: 8px
  h1
    @include TypeHeadline5()

@include media('<desktop')
  div.material-card
    border-radius: 0px
    // @include BoxShadow3()

</style>
