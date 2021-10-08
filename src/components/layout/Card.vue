<template>
  <div
    class="card"
    :class="{ riseTwo: rise === 2, riseThree: rise === 3 , riseFour: rise === 4, riseZero: rise === 0, secondary: secondary }"
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
    },
    secondary: {
      type: Boolean,
      required: false,
      default: false
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
  margin: 0
  border-radius: 12px
  &.riseTwo
    @include Rise2()
  &.riseThree
    @include Rise3()
  &.riseFour
    @include Rise4()
  &.riseZero
    box-shadow: none
  &.secondary
    background: linear-gradient(-42deg, var(--chroma-secondary-f) 0%, var(--chroma-secondary-c) 100%)

@include media('>phone')
  .card
    min-width: 220px
    max-width: 570px

// Material You inspired larger roundings to match
// the mobile screen round corners
@include media('<tablet')
  .card
    padding: 16px
    margin: 0
    border-radius: 12px
</style>
