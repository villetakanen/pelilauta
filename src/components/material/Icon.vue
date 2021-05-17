<template>
  <div
    class="icon"
    :class="{ xSmall: xSmall, inline: inline, medium: medium, headline: headline }"
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
    },
    inline: {
      type: Boolean,
      required: false,
      default: false
    },
    medium: {
      type: Boolean,
      required: false,
      default: false
    },
    headline: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup (props) {
    const icons = ref(new Map<string, Array<string>>())
    const slugs = [
      'about',
      'add',
      'addAnImage',
      'addDiscussion',
      'admin',
      'attachments',
      'avatar',
      'books',
      'd6',
      'd12',
      'd20',
      'discussion',
      'dd-logo',
      'delete',
      'edit',
      'equalizer',
      'filter',
      'forum',
      'hidden',
      'homebrew-logo',
      'idea',
      'images',
      'mekanismi',
      'monsters',
      'pathfinder-logo',
      'players',
      'remove',
      'report',
      'stats',
      'send',
      'settings',
      'share',
      'quick-logo',
      'up',
      'youtube'
    ]

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
  height: 96px
  width: 96px
  img
    height: 96px
    width: 96px

.material-action
  height: 32px
  width: 32px
  img
    height: 32px
    width: 32px

.material-button-icon
  .icon
    height: 32px
    width: 32px
    img
      height: 32px
      width: 32px

.fab
  .icon
    img
      height: 100%
      width: 100%

.xSmall
  height: 24px
  width: 24px
  img
    height: 20px
    width: 20px

.inline.icon
  display: inline-block
  height: 20px
  width: 20px
  padding: 2px
  margin: 0 4px
  vertical-align: middle
  img
    height: 20px
    width: 20px
    vertical-align: top
.inline.icon + .inline.icon
  margin-left: 0px

.headline.icon
  display: inline-block
  height: 44px
  width: 44px
  padding: 2px
  margin: 0 4px
  vertical-align: middle
  img
    height: 44px
    width: 44px
    vertical-align: top
.headline.icon + .headline.icon
  margin-left: 0px

.medium
  display: inline-block
  height: 36px
  width: 36px
  padding: 2px
  margin: 4px
  vertical-align: middle
  img
    height: 36px
    width: 36px
    vertical-align: top

.chipIcon
  height: 28px
  width: 28px
  margin: 2px
  img
    height: 28px
    width: 28px
    margin: 0px

.systemBadge
  height: 24px
  width: 24px
  img
    height: 24px
    width: 24px

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
