<template>
  <div
    class="loaderContainer"
    :class="{ poster: poster }"
  >
    <img
      src="@/assets/fox.svg"
      alt="Loading..."
    >
    <div
      class="loader"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Loader',
  props: {
    poster: {
      type: Boolean,
      required: false,
      default: false
    }
  }
})
</script>

<style lang="sass" scoped>
.loaderContainer
  position: relative
  img
    position: absolute
    top: 0
    left: 0
    height: 72px
    width: 72px
  &.poster
    display: block
    width: 100%
    height: 72px
    img
      position: absolute
      top: 40px
      left: 50%
      transform: translate(0, -50%)
    .loader
      position: absolute
      top: 0px
      left: 50%
      transform: translate(0, -50%)

.loader, .loader:after
  border-radius: 50%
  width: 56px
  height: 56px

.small
  .loaderContainer
    img
      height: 44px
      width: 44px

  .loader, .loader:after
    border-radius: 50%
    width: 32px
    height: 32px
  .loader
    margin: 2px
    border-top: 6px solid #00233711
    border-right: 6px solid #00233711
    border-bottom: 6px solid #00233711
    border-left: 6px solid #00233744

.loader
  position: relative
  text-indent: -9999em
  border-top: 8px solid #00233711
  border-right: 8px solid #00233711
  border-bottom: 8px solid #00233711
  border-left: 8px solid #00233744
  -webkit-transform: translateZ(0)
  -ms-transform: translateZ(0)
  transform: translateZ(0)
  -webkit-animation: load8 1.1s infinite linear
  animation: load 1.1s infinite linear

@-webkit-keyframes load
  0%
    -webkit-transform: rotate(0deg)
    transform: rotate(0deg)
  100%
    -webkit-transform: rotate(360deg)
    transform: rotate(360deg)
@keyframes load
  0%
    -webkit-transform: rotate(0deg)
    transform: rotate(0deg)
  100%
    -webkit-transform: rotate(360deg)
    transform: rotate(360deg)

</style>
