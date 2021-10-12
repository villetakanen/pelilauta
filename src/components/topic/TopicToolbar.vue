<template>
  <Header
    id="topicToolbar"
  >
    <ViewTitle
      :icon="icon"
      :parent=" $t('topic.home.title')"
    >
      {{ channel }}
    </ViewTitle>
    <SpacerDiv />
    <Action
      v-for="ch in channels"
      :key="ch.slug"
      :prepend="ch.icon"
      :to="'/stream/topic/'+ch.slug"
    >
      <span class="onlyForDesktop">{{ ch.name }}</span>
    </Action>
  </Header>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import Action from '../material/Action.vue'
import { useAuth } from '@/state/authz'
import { useMeta } from '@/state/meta'
import ViewTitle from '../layout/ViewTitle.vue'
import Header from '../layout/Header.vue'
import SpacerDiv from '../layout/SpacerDiv.vue'

export default defineComponent({
  components: { Action, ViewTitle, Header, SpacerDiv },
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
