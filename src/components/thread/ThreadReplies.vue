<template>
  <div
    class="ThreadReplies"
    :class="{ active: newActivityInThread }"
    @click="reroute('/thread/'+thread.id+'/view')"
  >
    <!--Icon inline name="discussion" /-->
    {{ thread.replyCount }}
    {{ $t('post.nOfReplies') }}
  </div>
</template>

<script lang="ts">
import { useUxActions } from '@/composables/useUxActions'
import { ThreadClass } from '@/state/threads/threads'
import { defineComponent } from 'vue'
// import Icon from '../material/Icon.vue'

export default defineComponent({
  name: 'ThreadLoves',
  components: { },
  props: {
    thread: {
      type: ThreadClass,
      required: true
    }
  },
  setup () {
    const { reroute } = useUxActions()

    return { reroute }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass

div.ThreadReplies
  @include TypeBody2()
  color: var(--chroma-primary-d)
  background-color: var(--chroma-primary-d-field-tint)
  line-height: 20px
  height: 20px
  padding: 2px 12px
  border-radius: 12px
  margin: 0
  position: relative
  transition: all 0.3s
  &.active
    background-color: var(--chroma-primary-i)

</style>
