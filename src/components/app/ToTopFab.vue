<template>
  <div class="toTopFab">
    <transition name="pop">
      <Fab3
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
import Fab3 from '../material3/Fab3.vue'

export default defineComponent({
  name: 'ToTopFab',
  components: { Fab3 },
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
