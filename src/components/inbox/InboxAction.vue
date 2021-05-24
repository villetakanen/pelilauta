<template>
  <div
    class="inboxAction"
    @click="clicks=clicks+1"
  >
    <Icon
      name="send"
      class="actionIcon"
      medium
      :class="{inactive: clicks < 1}"
    />
    <div
      v-if="clicks"
      class="inboxLenght"
    >
      {{ clicks }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Icon from '../material/Icon.vue'

export default defineComponent({
  name: 'InboxAction',
  components: { Icon },
  setup () {
    const clicks = ref(0)
    return { clicks }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/box-shadow.sass
@import @/styles/material-typography.sass

.inboxAction
  position: relative
  .inactive
    opacity: 0.7
  .inboxLenght
    @include TypeCaption()
    background-color: var(--chroma-primary-i)
    color: var(--chroma-primary-c)
    height: 16px
    width: auto
    position: absolute
    bottom: 0px
    right: 0px
    padding: 2px 8px
    text-align: center
    border-radius: 12px
    @include Rise2()
    pointer-events: none
</style>
