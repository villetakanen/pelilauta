<template>
  <Card>
    <h1 class="title">
      {{ $t('profile.inbox.title') }}
    </h1>
    <InboxMessageRow
      v-for="n, i in inboxMessages"
      :key="i"
      :notification="n"
      :index="i"
    />
  </Card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Card from '@/components/layout/Card.vue'
import { useInbox } from '@/state/inbox'
import InboxMessageRow from './InboxMessageRow.vue'

export default defineComponent({
  name: 'InboxMessages',
  components: { Card, InboxMessageRow },
  setup () {
    const { inboxMessages } = useInbox()
    return { inboxMessages }
  }
})
</script>
