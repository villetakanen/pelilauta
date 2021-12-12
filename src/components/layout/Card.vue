<template>
  <section
    class="card"
    :class="{
      riseTwo: rise === 2,
      riseThree: rise === 3 ,
      riseFour: rise === 4,
      riseZero: rise === 0,
      secondary: secondary,
      hasBottom: hasBottom
    }"
  >
    <slot />
    <Toolbar
      v-if="hasBottom"
      class="bottomToolbar"
    >
      <slot name="bottom" />
    </Toolbar>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Toolbar from './Toolbar.vue'

export default defineComponent({
  components: { Toolbar },
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
  },
  setup (props, { slots }) {
    const hasBottom = !!slots.bottom
    return { hasBottom }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/box-shadow.sass
@import @/styles/include-media.scss
@import @/styles/material-typography.sass

section.card
  @include Rise1()
  background-color: var(--chroma-clear)
  padding: 16px
  border-radius: 12px
  position: relative
  overflow: hidden
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
  &.hasBottom
    padding-bottom: 24px
  h1
    a
      color: var(--card-header-color)

  .bottomToolbar
    position: absolute
    bottom: -8px
    left: 0
    width: 100%
    box-sizing: border-box
    height: 24px
    align-items: center
    padding: 16px
    background-color: var(--card-toolbar-background-color)

section + section.card
  margin-top: 12px

@include media('>phone')
  .card
    min-width: 220px

// Material You inspired larger roundings to match
// the mobile screen round corners
@include media('<tablet')
  .card
    padding: 16px
    border-radius: 12px
</style>
