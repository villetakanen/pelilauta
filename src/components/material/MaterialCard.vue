<template>
  <div class="material-card">
    <slot />
  </div>
</template>

<style lang="sass">
@import @/styles/material-colors.sass

#app
  div.material-card
    @include TypeColorDark()
    background-color: white
    @include BoxShadow3()
    .title
      margin-bottom: 8px
</style>
