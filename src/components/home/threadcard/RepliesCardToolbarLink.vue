<template>
  <div class="repliesCardToolbarLink">
    <router-link :to="`/thread/${thread.id}/view/from/${seen}`">
      {{ thread ? thread.replyCount + ' ' + $t('post.nOfReplies') : $t('post.more') }}
    </router-link>
  </div>
</template>

<script lang="ts">
import { useProfile } from '@/state/authz'
import { Thread } from '@/utils/firestoreInterfaces'
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    thread: {
      type: Object as PropType<Thread>,
      required: true
    }
  },
  setup (props) {
    const { seenFrom } = useProfile()
    const seen = computed(() => (seenFrom(props.thread.id)))
    return { seen }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass

.repliesCardToolbarLink
  @include TypeCaption()
  background-color: #{'rgba(var(--chroma-primary-c-rgba), 0.11)'}
  line-height: 24px
  height: 24px
  padding: 0 12px
  margin-top: 8px
  border-radius: 12px
  a
    text-decoration: none

.withSite
  .repliesCardToolbarLink
    background-color: #{'rgba(var(--chroma-primary-c-rgba), 0.22)'}
</style>
