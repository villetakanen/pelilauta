<template>
  <li class="threadListItem">
    <router-link :to="`/thread/${thread.id}/view`">
      {{ thread.data.title }}
    </router-link>
    <p class="threadInfo">{{ toDisplayString(thread.flowTime) }}</p>
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

<style lang="sass" scoped>
@import @/styles/material-typography.sass

.threadListItem
  a
    text-decoration: none
    color: var(--chroma-secondary-c)
  .threadInfo
    @include TypeCaption()
    line-height: 16px
    margin-bottom: 8px
    color: var(--chroma-secondary-f)

</style>
