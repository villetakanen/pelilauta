<template>
  <Toolbar
    id="topicToolbar"
  >
    <h3>
      <Icon :name="icon" />{{ $t('topic.home.title') }}<span
        v-if="channel"
        class="hideOnMobile"
      > / {{ channel }}</span>
    </h3>
    <div class="spacer" />
    <Action
      v-if="showMemberTools"
      prepend="pelilauta"
      to="/"
    >
      <span class="onlyForDesktop">{{ $t('tomythreads') }}</span>
    </Action>
    <Action
      v-for="ch in channels"
      :key="ch.slug"
      :prepend="ch.icon"
      :to="'/stream/topic/'+ch.slug"
    >
      <span class="onlyForDesktop">{{ ch.name }}</span>
    </Action>
  </Toolbar>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import Toolbar from '../layout/Toolbar.vue'
import Action from '../material/Action.vue'
import Icon from '../material/Icon.vue'
import { useAuth } from '@/state/authz'
import { useMeta } from '@/state/meta'

export default defineComponent({
  components: { Toolbar, Action, Icon },
  props: {
    icon: {
      type: String,
      required: true
    },
    channel: {
      type: String,
      required: true
    }
  },
  setup () {
    const { showMemberTools } = useAuth()
    const { streams } = useMeta()
    const channels = computed(() => (streams.value.filter((s) => (s.slug !== '-'))))

    return { showMemberTools, channels }
  }
})
</script>
