<template>
  <div
    class="card"
    :class="{ riseTwo: rise === 2, riseThree: rise === 3 , riseFour: rise === 4 }"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    rise: {
      type: Number,
      required: false,
      default: 1
    }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/box-shadow.sass
@import @/styles/include-media.scss

.card
  @include Rise1()
  background-color: var(--chroma-clear)
  padding: 16px
  margin: 8px
  border-radius: 8px
  &.riseTwo
    @include Rise2()
  &.riseThree
    @include Rise3()
  &.riseFour
    @include Rise4()

@include media('>phone')
  .card
    min-width: 220px
    max-width: 570px
</style>
