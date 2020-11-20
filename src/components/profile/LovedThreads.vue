<template>
  <MaterialCard>
    <h1>{{ $t('LovedThreads.title') }}</h1>
    <div
      v-for="post in loved"
      :key="post.id"
    >
      <p>
        <router-link :to="`/stream/view/${post.id}`">
          {{ post.data.title }}
        </router-link>
      </p>
    </div>
  </MaterialCard>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import { useThreads } from '@/state/threads'
import { useProfile } from '@/state/authz'

export default defineComponent({
  name: 'LovedTheads',
  components: {
    MaterialCard
  },
  setup () {
    const { profileMeta } = useProfile()
    const { stream } = useThreads()
    const loved = computed(() => {
      return stream.value.filter((post) => (profileMeta.value.lovedThreads && profileMeta.value.lovedThreads.includes(post.id)))
    })
    return { loved }
  }
})
</script>
