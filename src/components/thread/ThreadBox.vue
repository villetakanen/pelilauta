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
  background-color: var(--chroma-clear)
  margin: 8px 8px
  padding: 16px
  max-width: 780px

@include media('<tablet')
  .threadBox
    margin: 0px
</style>
