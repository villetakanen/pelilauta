<template>
  <div class="threadBox">
    <slot />
  </div>
</template>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/box-shadow.sass

.threadBox
  @include Rise1()
  margin: 8px 8px
  padding: 16px

@include media('<tablet')
  .threadBox
    @include Rise0()
    margin: 0px
    padding: 0px
    padding: 8px
</style>
