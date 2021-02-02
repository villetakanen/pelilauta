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
    const active = computed(() => {
      const route = useRoute()
      return (route.name === props.to)
    })
    const clicked = () => {
      const router = useRouter()
      router.push(props.to)
    }
    return { active, clicked }
  }
})
</script>

<style lang="sass" scoped>
.materialAction
  &:hover
  .active
  &.theme--dark
    &:hover
    .active
</style>
