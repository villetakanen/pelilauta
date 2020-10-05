<template>
  <div
    v-ripple="'fixed'"
    class="material-fab"
    @click="clicked"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'MaterialFab',
  props: {
    to: {
      type: String,
      required: false,
      default: ''
    },
    action: {
      type: Function,
      required: false,
      default: undefined
    },
    text: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup (props) {
    const router = useRouter()

    function clicked () {
      if (props.to) router.push(props.to)
      else if (props.action) props.action()
    }

    return { clicked }
  }
})
</script>

<style lang="sass">
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.material-fab
  @include ElementColorSecondary()
  @include BoxShadow12()
  position: fixed
  bottom: 16px
  right: 16px
  height: 56px
  width: 56px
  margin: 0
  border-radius: 28px
  text-align: center
  z-index: 1
  overflow: hidden
  img
    position: relative
    display: inline-block
    height: 44px
    width: 44px
    margin: 6px
  .material-fab-text
    display: none

@include media('>1024px')
  .material-fab
    left:50%
    transform: translate(354px, 0)

</style>
