<template>
  <div class="material-pill">
    <slot />
  </div>
</template>

<style lang="sass" scoped>
.material-pill
  border: solid 1px black
  height: 20px
  border-radius: 10px
  display: inline-block
  box-sizing: border-box
  padding: 4px
  margin: 2px
</style>
