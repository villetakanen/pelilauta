<template>
  <div class="threadBoxTailer">
    <div class="toolbar toright">
      <div class="seendemo">
        {{ thread.seenCount }}
        <Icon
          name="eye"
          x-small
          class="seendemoicon"
        />
      </div>
      <LoveAThreadAction
        :authorid="thread.author"
        :loves="loves"
        :action="toggleLove"
        :count="thread.lovedCount"
        style="margin-right: 8px"
      />
    </div>
    <AuthorInfo :authorid="thread.author" />
  </div>
</template>

<script lang="ts">
import { useAuthState, useProfile } from '@/state/authz'
import { loveThread, unloveThread } from '@/state/threads'
import { Thread } from '@/utils/firestoreInterfaces'
import { computed, defineComponent, PropType } from 'vue'
import AuthorInfo from '../author/AuthorInfo.vue'
import Icon from '../material/Icon.vue'
import LoveAThreadAction from './LoveAThreadAction.vue'

export default defineComponent({
  name: 'ThreadBoxTailer',
  components: { AuthorInfo, LoveAThreadAction, Icon },
  props: {
    thread: {
      type: Object as PropType<Thread>,
      required: true
    }
  },
  setup (props) {
    const { uid } = useAuthState()
    const { profileMeta } = useProfile()
    const loves = computed(() => {
      if (typeof profileMeta.value.lovedThreads === 'undefined') return false
      return profileMeta.value.lovedThreads.includes(props.thread.id)
    })

    async function toggleLove () {
      // no-op if the author is trying to love their own posts
      if (props.thread.author === uid.value) return
      // love/unlove
      if (loves.value) {
        return unloveThread(uid.value, props.thread.id).then(() => {
        })
      } else {
        return loveThread(uid.value, props.thread.id).then(() => {
        })
      }
    }

    return { loves, toggleLove }
  }
})
</script>

<style lang="sass" scoped>
.toright
  align-items: center
  justify-content: flex-end
  margin-bottom: 8px
.seendemo
  margin-right: 8px
  background-color: #{'rgba(var(--chroma-primary-c-rgba), 0.11)'}
  padding: 0
  padding-left: 12px
  border-radius: 12px
  .seendemoicon
    opacity: 0.5
</style>
