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
  margin: 0
  margin-bottom: 16px
  padding: 16px
  background-color: white
  border: solid 1px #00233722
  box-shadow: 0px 0px 4px 0px rgba(0,35,55,0.11)
  .title
    margin-bottom: 8px
  h1, h2, h3, h4
    @include TypeHeadline5()
    a
      color: $color-fill-dark

</style>
