<template>
  <div class="card">
    <slot />
  </div>
</template>

<style lang="sass" scoped>
@import @/styles/box-shadow.sass

.card
  @include Rise1()
  background-color: var(--chroma-clear)
  padding: 16px
  margin: 8px
  border-radius: 8px
  min-width: 370px
</style>
