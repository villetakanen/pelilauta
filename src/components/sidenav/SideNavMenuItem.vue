<template>
  <li
    class="sideNavMenuItem"
    :class="propClasses"
  >
    <Icon
      :name="icon"
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
