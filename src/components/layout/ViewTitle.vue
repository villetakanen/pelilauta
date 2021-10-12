<template>
  <div
    class="viewTitle"
    :class="{ withIcon: icon && icon.length > 0 }"
  >
    <Icon
      v-if="icon"
      class="titleIcon"
      :name="icon"
    />
    <h2 v-if="parent">
      <router-link
        v-if="parentRoute"
        :to="parentRoute"
      >
        {{ parent }}
      </router-link>
      <template v-else>
        {{ parent }}
      </template>
    </h2>
    <h1 :class="{ withTitleIcon: icon }">
      <slot />
    </h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Icon from '../material/Icon.vue'

export default defineComponent({
  components: { Icon },
  props: {
    icon: {
      type: String,
      required: false,
      default: ''
    },
    parent: {
      type: String,
      required: false,
      default: ''
    },
    parentRoute: {
      type: String,
      required: false,
      default: ''
    }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-typography.sass

.viewTitle
  margin: 0
  padding: 0
  position: relative
  .titleIcon
    position: absolute
    top: 2px
    left: 2px
  h1
    @include TypeHeadline5()
    color: var(--chroma-secondary-a)
    line-height: 48px
    margin: 0
    padding: 0
    &.withTitleIcon
      padding-left: 56px
</style>
