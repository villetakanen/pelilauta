<template>
  <li class="threadListItem">
    <router-link :to="`/thread/${thread.id}/view`">
      {{ thread.data.title }}
    </router-link> <br>
    {{ toDisplayString(thread.flowTime) }}
  </li>
</template>

<script lang="ts">
import { Thread } from '@/utils/firestoreInterfaces'
import { defineComponent, PropType } from 'vue'
import { toDisplayString } from '@/utils/firebaseTools'

export default defineComponent({
  name: 'ThreadListItem',
  components: {
  },
  props: {
    thread: {
      type: Object as PropType<Thread>,
      required: true
    }
  },
  setup () {
    return { toDisplayString }
  }
})
</script>
