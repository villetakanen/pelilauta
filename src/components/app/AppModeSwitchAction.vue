<template>
  <div
    class="swapper"
    @click="swapMode"
  >
    <transition name="micropop">
      <Icon
        v-if="!mekanismi"
        name="mekanismi"
        class="absolute"
        color="dark"
      />
      <Icon
        v-else
        dark
        name="forum"
        class="absolute"
        color="dark"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { ComputedRef, defineComponent, inject } from 'vue'
import { useRouter } from 'vue-router'
import Icon from '../material/Icon.vue'

export default defineComponent({
  components: { Icon },
  setup () {
    const mekanismi = inject('appMode') as ComputedRef<boolean>
    const router = useRouter()
    const swapMode = () => {
      if (mekanismi.value) router.push('/')
      else router.push('/mekanismi')
    }
    return { mekanismi, swapMode }
  }
})
</script>

<style lang="sass">
@import @/styles/layout.sass
@import @/styles/box-shadow.sass

div.swapper
  @include SpacingIcon2()
  border-radius: 50%
  margin: 4px
  position: relative
  .icon
    background: var(--chroma-primary-g)
    @include Halo8()
    height: 48px
    width: 48px
    margin: 0
    padding: 0
    border-radius: 24px
    img
      height: 40px
      width: 40px
      padding: 4px
.micropop-enter-active,
.micropop-leave-active
  transition: all 0.3s
  transform: scale(1, 1)

.micropop-enter-from,
.micropop-leave-to
  transform: scale(0, 1)

.absolute
  position: absolute
  top: 0
  left: 0

</style>
