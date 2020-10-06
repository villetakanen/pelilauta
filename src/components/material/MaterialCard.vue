<template>
  <div class="material-card">
    <slot />
  </div>
</template>

<style lang="sass">
@import @/styles/material-colors.sass
@import @/styles/layout.sass

#app
  div.material-card
    @include TypeColorDark()
    @include SpacingContainer()
    background-color: white
    @include BoxShadow1()
    border-radius: 4px
    .title
      margin-bottom: 8px
</style>
