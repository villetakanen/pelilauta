<template>
  <li
    class="sideNavMenuItem"
    :class="propClasses"
  >
    <Icon
      medium
      :name="icon"
      class="icon"
    />
    <router-link :to="to">
      <slot />
    </router-link>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Icon from '@/components/material/Icon.vue'

export default defineComponent({
  name: 'SideNavMenuItem',
  components: { Icon },
  props: {
    mobileOnly: {
      type: Boolean,
      required: false,
      default: false
    },
    desktopOnly: {
      type: Boolean,
      required: false,
      default: false
    },
    icon: {
      type: String,
      required: false,
      default: ''
    },
    to: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const propClasses = {
      desktop: props.desktopOnly && !props.mobileOnly,
      mobile: !props.desktopOnly && props.mobileOnly
    }
    return { propClasses }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-typography.sass

.sideNavMenuItem
  @include TypeButton()
  a
    color: var(--chroma-secondary-b)
    text-decoration: none
    padding-left: 8px
  &:hover
    background-color: #{'rgba(var(--chroma-primary-c-rgba), 0.44)'}
    border-radius: 0 24px 24px 0
    .icon
      background-color: var(--chroma-clear)
      border-radius: 50%

@include media('>=tablet')
  .sideNavMenuItem.mobile
    display: none
</style>
