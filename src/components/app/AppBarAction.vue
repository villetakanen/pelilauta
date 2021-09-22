<template>
  <div
    class="appBarAction"
    :class="{ active: active }"
    @click="clicked"
  >
    <Icon
      :name="icon"
      class="onlyForMobile mobileIcon"
      medium
    />
    <Icon
      class="hideOnMobile desktopIcon"
      :name="icon"
      x-small
    />
    <span
      v-if="label"
      class="hideOnMobile"
    >{{ label }}</span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Icon from '@/components/material/Icon.vue'

export default defineComponent({
  components: { Icon },
  props: {
    to: {
      type: String,
      required: false,
      default: ''
    },
    icon: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: false,
      default: ''
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup (props) {
    const route = useRoute()
    const router = useRouter()

    const active = computed(() => {
      return (props.to && route.name === router.resolve(props.to).name)
    })

    const clicked = () => {
      if (!props.to || props.disabled) return
      // route with a name
      if (router.hasRoute(props.to)) router.push({ name: props.to })
      // route with params
      else router.push(props.to)
    }

    return { active, clicked }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass
@import @/styles/include-media.scss

.appBarAction
  height: 40px
  padding: 0
  margin: 4px
  border-radius: 20px
  transition: background-color 300ms linear
  .mobileIcon
    margin: 0px
  &:hover
    background-color: var(--color-b-h)
  &.active
    background-color: var(--color-b-i)

@include media('>tablet')
  .appBarAction
    @include TypeButton()
    white-space: nowrap
    padding-right: 10px
    margin: 4px
    .desktopIcon
      margin: 10px
      margin-right: 0
</style>
