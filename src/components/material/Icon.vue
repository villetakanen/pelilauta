<template>
  <img
    ref="icon"
    :src="sourcePath"
    :alt="name"
    class="icon"
    :class="{ medium: medium, large: large, small: small, xs: xs, xlarge: xlarge }"
  >
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import iconslist from './iconslist.json'

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
    xs: {
      type: Boolean,
      required: false,
      default: false
    },
    small: {
      type: Boolean,
      required: false,
      default: false
    },
    dark: {
      type: Boolean,
      required: false,
      default: false
    },
    medium: {
      type: Boolean,
      required: false,
      default: false
    },
    large: {
      type: Boolean,
      required: false,
      default: false
    },
    xlarge: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup (props) {
    const icons = ref(new Map<string, Array<string>>())
    const slugs = iconslist.icons

    function addIcon (slug: string) {
      icons.value.set(slug, [
        require('@/assets/icons/light/' + slug + '.svg'),
        require('@/assets/icons/dark/' + slug + '.svg')
      ])
    }

    // Direct requires
    slugs.forEach((slug) => { addIcon(slug) })

    // Redirects
    icons.value.set('mekanismi-logo', [
      require('@/assets/icons/light/mekanismi.svg'),
      require('@/assets/icons/dark/mekanismi.svg')
    ])
    icons.value.set('pelilauta', [
      require('@/assets/icons/light/fox.svg'),
      require('@/assets/icons/dark/fox.svg')
    ])

    const sourcePath = computed(() => {
      const srcs = icons.value.get(props.name)
      if (Array.isArray(srcs) && srcs.length === 2) return props.dark ? srcs[1] : srcs[0]
      console.warn('Missing icon', props.name, props.dark ? 'dark' : 'light')
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

img.icon
  display: inline-block
  margin: 0
  padding: 0
  vertical-align: middle
  height: 48px
  width: 48px
  &.small
    height: 24px
    width: 24px
  &.medium
    height: 36px
    height: 36px
  &.xs
    height: 16px
    width: 16px
  &.xlarge
    height: 128px
    width: 128px

button:not(.Fab) .icon
  display: inline-block
  margin: 0
  margin-left: -8px
  margin-right: 8px
  padding: 0
  vertical-align: middle

@include media('<tablet')
  button:not(.Fab) .icon
    margin: 0

</style>
