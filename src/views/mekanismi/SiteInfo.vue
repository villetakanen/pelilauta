<template>
  <div>
    <transition name="fade">
      <div v-if="site && site.name">
        <MaterialCard>
          <h1>{{ site.name }}</h1>
          <p><i>{{ site.description }}</i></p>
        </MaterialCard>
        <MaterialCard>
          {{ site }}
        </MaterialCard>
      </div>
      <Loader v-else />
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, provide, watch } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import { useSite, subscribeTo } from '@/state/site'
import Loader from '@/components/app/Loader.vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'WikiIndex',
  components: {
    MaterialCard,
    Loader
  },
  setup () {
    const { site } = useSite()

    const route = useRoute()

    provide('site', site)

    watch(() => route.params, (r) => {
      const id = Array.isArray(r.siteid) ? r.siteid[0] : r.siteid || ''
      subscribeTo(id)
    }, { immediate: true })

    return { site }
  }
})
</script>
