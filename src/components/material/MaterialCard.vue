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
  border-radius: 8px
  img
    max-width: 100%
    &.cardPoster
     width: calc(100% + 32px)
     max-width: calc(100% + 32px)
     margin: 8px -16px
  .title
    margin-bottom: 8px
  h1, h2, h3, h4
    @include TypeHeadline5()
    overflow: hidden
    text-overflow: ellipsis
    word-break: break-word
    display: block
    a
      color: $color-fill-dark
      text-overflow: ellipsis
  .cardActions
    padding: 0
    margin-top: 8px
  .ql-container
    height: auto
</style>
