<template>
  <div class="threadBox">
    <slot />
  </div>
</template>

<style lang="sass" scoped>
@import @/styles/include-media.scss

.threadBox
  background-color: var(--color-fill-background)
  margin: 0 8px
  padding: 16px
  max-width: 780px

@include media('<tablet')
  .threadBox
    margin: 0px
</style>
