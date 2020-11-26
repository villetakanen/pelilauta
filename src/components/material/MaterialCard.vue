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
  border: solid 1px #00233733
  .title
    margin-bottom: 8px
  h1
    @include TypeHeadline5()

</style>
