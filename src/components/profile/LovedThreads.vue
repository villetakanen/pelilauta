<template>
  <Card>
    <h1 class="title">
      {{ $t('LovedThreads.title') }}
    </h1>
    <div
      v-for="post in loved"
      :key="post.id"
    >
      <p>
        <router-link :to="`/thread/${post.id}/view`">
          {{ post.data.title }}
        </router-link>
      </p>
    </div>
  </Card>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import Card from '@/components/layout/Card.vue'
import { useThreads } from '@/state/threads'
import { useProfile } from '@/state/authz'

export default defineComponent({
  name: 'LovedTheads',
  components: {
    Card
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
