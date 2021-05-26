<template>
  <Card>
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
  components: { Card, InboxMessageRow },
  setup () {
    const { inboxMessages } = useInbox()
    return { inboxMessages }
  }
})
</script>
