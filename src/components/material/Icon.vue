<template>
  <div
    class="icon"
    :class="{ xSmall: xSmall }"
  >
    <img
      ref="icon"
      :src="sourcePath"
      :alt="name"
    >
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    name: {
      type: String,
      required: false,
      default: ''
    },
    color: {
      type: String,
      required: false,
      default: ''
    },
    xSmall: {
      type: Boolean,
      required: false,
      default: false
    },
    dark: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup (props) {
    const icons = ref(new Map<string, Array<string>>())

    icons.value.set('avatar', [
      require('@/assets/icons/light/avatar.svg'),
      require('@/assets/icons/dark/avatar.svg')
    ])
    icons.value.set('filter', [
      require('@/assets/icons/light/filter.svg'),
      require('@/assets/icons/dark/filter.svg')
    ])
    icons.value.set('forum', [
      require('@/assets/icons/light/forum.svg'),
      require('@/assets/icons/dark/forum.svg')
    ])
    icons.value.set('mekanismi', [
      require('@/assets/icons/light/mekanismi.svg'),
      require('@/assets/icons/dark/mekanismi.svg')
    ])

    const sourcePath = computed(() => {
      const srcs = icons.value.get(props.name)
      if (Array.isArray(srcs) && srcs.length === 2) return props.dark ? srcs[1] : srcs[0]
      console.debug('Missing icon', props.name, props.dark ? 'dark' : 'light')
      return require('@/assets/icons/light/d12.svg')
    })

    return { sourcePath }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.icon
  display: inline-block
  vertical-align: middle

.material-action
  img
    height: 32px
    width: 32px

.xSmall
  height: 20px
  width: 20px
  padding: 0
  margin: 2px // 2 * 2 + 20 = 24 = em
  img
    height: 20px
    width: 20px

.chipIcon
  img
    height: 16px
    width: 16px
    margin: 2px

.material-pill
  .icon-container
    .icon
      img
        height: 28px
        width: 28px
        padding: 2px
        vertical-align: middle
  &.small
    .icon-container
      .icon
        img
          height: 22px
          width: 22px
          padding: 1px

</style>
