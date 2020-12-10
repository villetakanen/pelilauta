<template>
  <div
    class="imageBox"
    :class="{ album: images && images.length > 1 }"
  >
    <div
      v-for="(url, index) in zippedImages"
      :key="url.url"
      class="frame"
    >
      <img
        v-if="index < 3"
        :src="url.url"
        alt=""
      >
    </div>
    <div
      v-if="images.length > 3"
      class="frame"
      style="opacity: 0.5"
    >
      <img
        src="@/assets/icons/search.svg"
        alt="and more"
      >
    </div>
  </div>
</template>

<script lang="ts">
import { PostImage } from '@/lib/stream'
import { computed, defineComponent, PropType } from 'vue'
export default defineComponent({
  name: 'MaterialImageBox',
  props: {
    images: {
      type: Array as PropType<PostImage[]>,
      required: true,
      default: new Array<PostImage>()
    }
  },
  setup (props) {
    const zippedImages = computed(() => {
      if (props.images && props.images.length > 3) return props.images.filter((val, index) => (index < 3))
      return props.images
    })
    return { zippedImages }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/layout.sass
@import @/styles/material-typography.sass
@import @/styles/include-media.scss

.imageBox
  background: linear-gradient(203deg, rgba(0,121,107,1) 0%, rgba(0,35,55,1) 71%)
  vertical-align: middle
  &.album
    width: 212px
    height: 212px
    padding: 4px
    display: flex
    flex-wrap: wrap
    div.frame
      width: 96px
      margin: 4px
      flex-grow: 0
      flex-shrink: 0
      img
        max-width: 96px
        max-height: 96px
        display: block
        margin: auto
        padding: 0

@include media('>tablet')
  .imageBox
    img
      max-width: 220px
      margin-left: auto
      margin-right: auto
      display: block

@include media('<tablet')
  .imageBox
    img
      max-width: 100%
      max-height: 600px
    &.album
      width: 80vw
      height: 80vw
      padding:0
      div.frame
        width: 40vw
        height: 40vw
        padding: 0
        margin: 0
        img
          max-width: 38vw
          max-height: 38vw
          padding: 1vw

</style>
