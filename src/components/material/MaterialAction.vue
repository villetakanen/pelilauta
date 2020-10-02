<template>
  <div :class="'material-action ' + (text ? 'material-action-text' : '') " @click="clicked">
    <img v-if="icon === 'topic'" class="material-action-icon" src="@/assets/topic.svg">
    <img v-if="icon === 'about'" class="material-action-icon" src="@/assets/about.svg">
    <img v-if="!icon" class="material-action-icon" src="@/assets/fox.svg">
    <div class="material-action-title">{{text}}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'MaterialAction',
  props: {
    icon: {
      type: String,
      required: false
    },
    text: {
      type: String,
      required: false
    },
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
    }

    return { clicked }
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
  .material-action-text
    width: 44px
    .material-action-title
      display: none
    .material-action-icon
      height: 36px
      widht: 36px
      margin: 3px
</style>
