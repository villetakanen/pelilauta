<template>
  <Card>
    ...
    {{ inboxMessages }}
  </Card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Card from '@/components/layout/Card.vue'
import { useInbox } from '@/state/inbox'

export default defineComponent({
  components: { Card },
  setup () {
    const { inboxMessages } = useInbox()
    return { inboxMessages }
  }
})
</script>
