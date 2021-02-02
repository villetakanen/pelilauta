<template>
  <div
    class="materialAction"
    :class="{ 'theme--dark': dark, active: active }"
    @click="clicked"
  >
    <slot name="prepend" />
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
  height: 24px
  padding: 8px 14px
  margin: 4px
  line-height: 24px
  border-radius: 20px
  transition: background-color 300ms linear
  div.icon
    margin: 0
    padding: 0
    img
      height: 24px
      width: 24px
      margin: 0
      margin-right: 4px
      padding: 0
      vertical-align: middle
  &:hover
  .active
  &.theme--dark
    color: white
    &:hover, &.active:hover
      background-color: rgba(255,255,255,0.22)
    &.active
      background-color: rgba(255,255,255,0.11)

</style>
