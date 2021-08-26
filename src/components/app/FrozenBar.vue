<template>
  <div class="frozenBar">
    {{ $t('app.accountFrozen') }}
  </div>
</template>

<style lang="sass" scoped>
.frozenBar
  text-align: center
  background-color: var(--chroma-secondary-i)
  border-top: solid 2px var(--chroma-secondary-h)
  border-bottom: solid 2px var(--chroma-secondary-h)
  line-height: 44px
  color: var(--chroma-secondary-d)
</style>
