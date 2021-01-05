<template>
  <div>
    <transition name="fade">
      <div v-if="site && site.name">
        <MaterialCard>
          <h1>{{ site.name }}</h1>
          <p><i>{{ site.description }}</i></p>
        </MaterialCard>
        <MaterialCard>
          <h1>{{ $t('site.owners') }}</h1>
          <Pill
            v-for="owner in site.owners"
            :key="owner"
          >
            {{ owner }}
          </Pill>
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
import Pill from '@/components/material/Pill.vue'

export default defineComponent({
  name: 'WikiIndex',
  components: {
    MaterialCard,
    Loader,
    Pill
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
