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
    <Button
      v-for="ch in channels"
      :key="ch.slug"
      text
      @click.prevent="reroute('/threads/'+ch.slug)"
    >
      <Icon
        :name="ch.icon"
        small
      />
      <span class="onlyForDesktop">{{ ch.name }}</span>
    </Button>
  </Header>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useAuth } from '@/state/authz'
import { useMeta } from '@/state/meta'
import ViewTitle from '../layout/ViewTitle.vue'
import Header from '../layout/Header.vue'
import SpacerDiv from '../layout/SpacerDiv.vue'
import Button from '../form/Button.vue'
import Icon from '../material/Icon.vue'
import { useUxActions } from '@/composables/useUxActions'

export default defineComponent({
  components: { ViewTitle, Header, SpacerDiv, Button, Icon },
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
    const { reroute } = useUxActions()
    return { showMemberTools, channels, reroute }
  }
})
</script>
