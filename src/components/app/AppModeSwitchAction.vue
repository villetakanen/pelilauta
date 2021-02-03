<template>
  <div
    class="swapper"
    @click="swapMode"
  >
    <transition name="micropop">
      <Icon
        v-if="!mekanismi"
        name="mekanismi"
        color="dark"
        class="absolute"
      />
      <Icon
        v-else
        dark
        name="forum"
        color="dark"
        class="absolute"
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
.swapper
  height: 40px
  width: 40px
  position: relative
  margin: 4px
  padding: 0
  .icon
    background: rgba(255,255,255,0.22)
    height: 40px
    width: 40px
    margin: 0
    padding: 0
    border-radius: 20px
    img
      height: 36px
      width: 36px
      padding: 2px
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
