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
          <OwnerPill
            v-for="owner in site.owners"
            :key="owner"
            :uid="owner"
          />
          <hr>
          <OwnerPill
            v-for="author in nonOwners"
            :key="author"
            :uid="author"
            :add="true"
          />
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
import { computed, defineComponent, provide, watch } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import { useSite, subscribeTo } from '@/state/site'
import Loader from '@/components/app/Loader.vue'
import { useRoute } from 'vue-router'
import OwnerPill from '@/components/sites/OwnerPill.vue'
import { useAuthors } from '@/lib/authors'

export default defineComponent({
  name: 'WikiIndex',
  components: {
    MaterialCard,
    Loader,
    OwnerPill
  },
  setup () {
    const { site } = useSite()
    const { authors } = useAuthors()
    const nonOwners = computed(() => {
      const availableAuthors = authors.value.filter((author) => {
        return site.value.owners && !site.value.owners.includes(author.uid || '')
      })
      return availableAuthors.map((author) => (author?.uid || ''))
    })
    const route = useRoute()

    provide('site', site)

    watch(() => route.params, (r) => {
      const id = Array.isArray(r.siteid) ? r.siteid[0] : r.siteid || ''
      subscribeTo(id)
    }, { immediate: true })

    return { site, nonOwners }
  }
})
</script>
