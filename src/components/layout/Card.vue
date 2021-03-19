<template>
  <div class="card">
    <slot />
  </div>
</template>

<style lang="sass" scoped>
@import @/styles/box-shadow.sass
@import @/styles/include-media.scss

.card
  @include Rise1()
  background-color: var(--chroma-clear)
  padding: 16px
  margin: 8px
  border-radius: 8px

@include media('>phone')
  .card
    min-width: 220px
    max-width: 570px
</style>
