<template>
  <div
    id="AppBar"
    :class="appBarClasses"
  >
    <div
      id="AppBarToolbar"
      class="toolbar"
    >
      <MaterialAction
        to="/"
      />
      <h1 class="font-button">
        Pelilauta 2
      </h1>
      <div class="spacer" />
      <MaterialAction
        text="Topics"
        icon="topic"
        to="/stream/index"
      />
      <MaterialAction
        desktop
        to="/about"
        icon="about"
      />
      <ProfileAction />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import ProfileAction from './ProfileAction.vue'
import MaterialAction from '@/components/material/MaterialAction.vue'
export default defineComponent({
  components: {
    ProfileAction,
    MaterialAction
  },
  setup () {
    const appBarClasses = ref({
      elevated: false
    })
    const handleScroll = () => {
      // console.log(window.scrollY)
      if (window.scrollY > 0) appBarClasses.value.elevated = true
      else appBarClasses.value.elevated = false
    }
    onMounted(() => { window.addEventListener('scroll', handleScroll) })
    return { appBarClasses }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

#AppBar
  position: sticky
  transition: box-shadow 0.8s
  box-shadow: none
  #AppBarToolbar
  &.elevated
    @include BoxShadow3()

</style>
