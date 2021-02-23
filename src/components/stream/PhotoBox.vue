<template>
  <div class="photoBox">
    <img
      v-for="url in postImages"
      :key="url.url"
      :src="url.url"
      alt=""
    >
  </div>
</template>

<script lang="ts">
import { PostImage } from '@/utils/uiInterfaces'
import { defineComponent, PropType, computed } from 'vue'
export default defineComponent({
  name: 'PhotoBox',
  props: {
    photos: {
      type: Array as PropType<PostImage[]>,
      required: true,
      default: new Array<PostImage>()
    }
  },
  setup (props) {
    const postImages = computed(() => (props.photos as Array<PostImage>))
    return { postImages }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/layout.sass
@import @/styles/material-typography.sass
@import @/styles/include-media.scss

.photoBox
  background-color: $color-base-dark
  text-align: center
  margin: 8px 0
  padding: 0
  display: flex
  overflow: hidden
  justify-content: center
  img
    @include BoxShadow24()
    max-height: 300px
    margin: 0 8px
    padding: 0
    align-self: center
    &:first-of-type
      margin-left: 0
</style>
