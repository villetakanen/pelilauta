<template>
  <MaterialCard>
    <h1>{{ $t('LovedThreads.title') }}</h1>
    <div
      v-for="post in loved"
      :key="post.postid"
    >
      <p>
        <router-link :to="`/stream/view/${post.postid}`">
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
import { useStream } from '@/lib/stream'

export default defineComponent({
  name: 'LovedTheads',
  components: {
    MaterialCard
  },
  setup () {
    const { profile } = useAuthz()
    const { stream } = useStream()
    const loved = computed(() => {
      return stream.value.filter((post) => (profile.value.lovedThreads && profile.value.lovedThreads.includes(post.postid)))
    })
    return { profile, loved }
  }
})
</script>
