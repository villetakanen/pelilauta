<template>
  <MaterialCard>
    <h1>{{ $t('LovedThreads.title') }}</h1>
    <div
      v-for="post in loved"
      :key="post.threadid"
    >
      <p>
        <router-link :to="`/stream/view/${post.threadid}`">
          {{ post.data.title }}
        </router-link>
      </p>
    </div>
  </MaterialCard>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
// import { useRouter } from 'vue-router'
import MaterialCard from '@/components/material/MaterialCard.vue'
import { useAuthz } from '@/lib/authz'
import { useThreads } from '@/state/threads'

export default defineComponent({
  name: 'LovedTheads',
  components: {
    MaterialCard
  },
  setup () {
    const { profile } = useAuthz()
    const { stream } = useThreads()
    const loved = computed(() => {
      return stream.value.filter((post) => (profile.value.lovedThreads && profile.value.lovedThreads.includes(post.id)))
    })
    return { profile, loved }
  }
})
</script>
