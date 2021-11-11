<template>
  <div
    class="viewTitle"
    :class="{ withIcon: icon && icon.length > 0 }"
  >
    <Icon
      v-if="icon"
      class="titleIcon"
      :name="icon"
      medium
    />
    <h2
      v-if="parent"
      :class="{ withTitleIcon: icon}"
    >
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
    <h1
      class="highEmphasis truncTwoLines"
      :class="{ withTitleIcon: icon, withParent: parent }"
    >
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
  margin: 0 8px
  padding: 0
  position: relative
  .titleIcon
    position: absolute
    top: 4px
    left: 4px
  h1
    @include TypeHeadline5()
    color: var(--chroma-secondary-a)
    line-height: 48px
    margin: 0
    padding: 0
    &.withTitleIcon
      padding-left: 56px
    &.withParent
      line-height: 28px
  h2
    @include TypeCaption()
    line-height: 20px
    margin: 0
    padding: 0
    color: var(--chroma-secondary-d)
    &.withTitleIcon
      padding-left: 56px
</style>
