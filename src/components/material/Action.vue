<template>
  <div
    class="materialAction"
    :class="{ 'theme--dark': dark, active: active }"
    @click="clicked"
  >
    <Icon
      v-if="prepend"
      :name="prepend"
      :color="dark ? 'dark' : ''"
      class="prepend"
    />
    <div class="label"><slot /></div>
    <Icon
      v-if="append"
      :name="append"
      :color="dark ? 'dark' : ''"
      class="append"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Icon from './Icon.vue'

export default defineComponent({
  components: { Icon },
  props: {
    to: {
      type: String,
      required: true
    },
    dark: {
      type: Boolean,
      required: false,
      default: false
    },
    prepend: {
      type: String,
      required: false,
      default: ''
    },
    append: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup (props) {
    const route = useRoute()
    const router = useRouter()

    const active = computed(() => {
      return (route.name === router.resolve(props.to).name)
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
  div.label
    display: inline-block
  div.prepend+div.label
    margin-left: 4px
  div.label+div.append
    margin-left: 4px
  div.label:empty
    display: none
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
