<template>
  <div class="toTopFab">
    <transition name="pop">
      <Fab
        v-if="toTopVisibleToggle"
        tertiary
        icon="up"
        @click="toTopAction"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Fab from '../material/Fab.vue'

export default defineComponent({
  name: 'ToTopFab',
  components: { Fab },
  setup () {
    // *** On Scroll, show to top FAB ***************************************

    const toTopVisibleToggle = ref(false)
    document.addEventListener('scroll', (e: Event) => {
      const top = window.pageYOffset || (e.target as HTMLElement).scrollTop || 0
      toTopVisibleToggle.value = top > 112
    })

    const toTopAction = () => {
      const rootElement = document.documentElement
      rootElement.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    return { toTopAction, toTopVisibleToggle }
  }
})
</script>
