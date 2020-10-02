<template>
    <div
      class="material-fab"
      v-ripple
      @click="clicked">
      <slot></slot>
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
      required: false
    },
    action: {
      type: Function,
      required: false
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
  border-radius: 50%
  text-align: center
  z-index: 1
  overflow: hidden
  img
    height: 44px
    width: 44px
    margin: 6px

@include media('>1024px')
  .material-fab
    left:50%
    transform: translate(354px, 0)

</style>
