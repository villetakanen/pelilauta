<template>
  <div class="ThreadsHomeView">
    <Header>
      <ViewTitle icon="discussion">
        {{ $t('threads.home.title') }}
      </ViewTitle>
    </Header>
    <main class="bookLayout">
      <LatestThreads class="double-cut" />
      <CommentedThreads class="double-cut" />
      <LikedThreads class="double-cut" />
    </main>
  </div>
</template>

<script lang="ts">
import Header from '@/components/layout/Header.vue'
import ViewTitle from '@/components/layout/ViewTitle.vue'
import CommentedThreads from '@/components/threads/CommentedThreads.vue'
import LatestThreads from '@/components/threads/LatestThreads.vue'
import LikedThreads from '@/components/threads/LikedThreads.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ThreadsHomeView',
  components: {
    Header,
    ViewTitle,
    LatestThreads,
    CommentedThreads,
    LikedThreads
  },
  setup () {
  }
})
</script>
