<template>
  <div class="threadsHomeView">
    <Header>
      <ViewTitle icon="pelilauta">
        {{ $t('threads.home.title') }}
      </ViewTitle>
    </Header>
    <nav style="text-align:center;margin: 12px; margin-top:24px">
      <div class="buttons double chroma-box-1">
        <Button
          v-for="channel in streams"
          :key="channel.slug"
          text
          dark
          @click="reroute('/threads/'+channel.slug)"
        >
          <Icon
            dark
            :name="channel.icon"
            medium
          /> {{ channel.name }} <span class="count">{{ channel.count }}</span>
        </Button>
      </div>
    </nav>
    <main
      class="bookLayout"
      style="margin-top:24px"
    >
      <LatestThreads />
      <RepliedThreads />
      <LikedThreads />
    </main>
  </div>
</template>

<script lang="ts">
import Header from '@/components/layout/Header.vue'
import ViewTitle from '@/components/layout/ViewTitle.vue'
import RepliedThreads from '@/components/threads/RepliedThreads.vue'
import LatestThreads from '@/components/threads/LatestThreads.vue'
import LikedThreads from '@/components/threads/LikedThreads.vue'
import { computed, defineComponent } from 'vue'
import { useMeta } from '@/state/meta'
import { useUxActions } from '@/composables/useUxActions'
import Icon from '@/components/material/Icon.vue'
import Button from '@/components/form/Button.vue'

export default defineComponent({
  name: 'ThreadsHomeView',
  components: {
    Header,
    ViewTitle,
    LatestThreads,
    RepliedThreads,
    LikedThreads,
    Icon,
    Button
  },
  setup () {
    const { streams: streamsRaw } = useMeta()
    const { reroute } = useUxActions()
    const streams = computed(() => (streamsRaw.value.filter((c) => (c.slug !== '-'))))
    return { streams, reroute }
  }
})
</script>

<style lang="sass" scoped>
.buttons
  align-content: center
  text-align: center
  display: inline-block
  margin: 0 auto
  border-radius: 12px
  padding: 4px 12px
</style>
