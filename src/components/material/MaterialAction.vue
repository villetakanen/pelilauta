<template>
  <div
    v-ripple="'fixed-y'"
    class="material-action"
    :class="classes"
    @click="clicked"
  >
    <img
      v-if="icon === 'topic'"
      class="material-action-icon"
      src="@/assets/topic.svg"
    >
    <img
      v-if="icon === 'about'"
      class="material-action-icon"
      src="@/assets/about.svg"
    >
    <img
      v-if="!icon"
      class="material-action-icon"
      src="@/assets/fox.svg"
    >
    <div class="material-action-title">
      {{ text }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'MaterialAction',
  props: {
    icon: {
      type: String,
      required: false,
      default: ''
    },
    text: {
      type: String,
      required: false,
      default: ''
    },
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
    desktop: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup (props) {
    const router = useRouter()
    const classes = computed(() => {
      const arrr: string[] = []
      if (props.text) arrr.push('material-action-text')
      console.log(props.desktop)
      if (props.desktop) arrr.push('desktop-only')
      return arrr
    })

    function clicked () {
      if (props.to) router.push(props.to)
    }

    return { clicked, classes }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.material-action
  height: 44px
  margin: 6px
  text-align: center
  border-radius: 22px
  position: relative
  overflow: hidden
  .material-action-icon
    vertical-align: middle
    height: 36px
    widht: 36px
    margin: 3px
    opacity: 0.8
  &:first-of-type
    margin-left: 0

.material-action-text
  .material-action-title
    @include TypeButton()
    display: inline-block
    vertical-align: middle
    margin-right: 16px
  .material-action-icon
    vertical-align: middle
    height: 22px
    widht: 22px
    margin: 11px
    margin-right: 6px
    margin-left: 8px

@include media('<desktop')
  .desktop-only
    display: none
  .material-action-text
    width: 44px
    .material-action-title
      display: none
    .material-action-icon
      height: 32px
      widht: 32px
      margin: 6px
</style>
