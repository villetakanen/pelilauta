<template>
  <div class="card">
    <slot />
  </div>
</template>

<style lang="sass" scoped>
.card
  background-color: var(--chroma-clear)
  padding: 16px
  margin: 8px
  box-shadow: 0 0 2px 0px var(--chroma-secondary-h)
</style>
