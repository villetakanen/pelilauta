<template>
  <div
    class="materialAction"
    :class="{ 'theme--dark': dark, active: active }"
    @click="clicked"
  >
    <span class="prepend"><slot name="prepend" /></span>
    <slot />
    <slot name="append" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  props: {
    to: {
      type: String,
      required: true
    },
    dark: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup (props) {
    const route = useRoute()
    const router = useRouter()

    const active = computed(() => {
      console.log(route.name, props.to)
      return (route.name === props.to)
    })

    const clicked = () => {
      router.push({ name: props.to })
    }

    return { active, clicked }
  }
})
</script>

<style lang="sass">
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.materialAction
  @include TypeButton()
  height: 40px
  padding: 8px 14px
  margin: 4px
  line-height: 24px
  border-radius: 20px
  transition: background-color 300ms linear
  display: inline-block
  box-sizing: border-box
  div.icon
    margin: 0
    padding: 0
    height: 26px
    width: 26px
    position: relative
    img
      height: 24px
      width: 24px
      top: 0
      left: 0
      position: absolute
  .prepend
    div.icon
      margin-right: 4px
  .slot
    line-height: 24px
    display: inline-block
  .prepend
    line-height: 24px
    display: inline-block
  &:hover
    background-color: rgba($color-fill-dark,0.22)
  &.active
    background-color: rgba($color-fill-dark,0.11)
  &.theme--dark
    color: white
    &:hover, &.active:hover
      background-color: rgba(255,255,255,0.22)
    &.active
      background-color: rgba(255,255,255,0.11)

</style>
