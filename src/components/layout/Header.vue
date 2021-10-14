<template>
  <header :class="{sticky: sticky, stickyShadow: stickyShadow}">
    <slot />
  </header>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  props: {
    sticky: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup (props) {
    const stickyShadow = ref(false)
    onMounted(() => {
      if (props.sticky) {
        document.addEventListener('scroll', (e: Event) => {
          const top = window.pageYOffset || (e.target as HTMLElement).scrollTop || 0
          stickyShadow.value = top > 56
        })
      }
    })
    return { stickyShadow }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/box-shadow.sass

header
  display: flex
  margin: 0
  padding: 0
  gap: 8px
  flex-wrap: wrap
  &.sticky
    transition: all 0.3s
    position: sticky
    position: -webkit-sticky
    top: 0px
    background-color: var(--chroma-clear)
  &.stickyShadow
    @include Rise1()
    //border-bottom: solid 1px var(--chroma-secondary-g)

</style>
