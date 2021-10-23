<template>
  <div class="threadBoxTailer">
    <Toolbar>
      <p class="TypeCaption">
        {{ toDisplayString(thread.created) }}
      </p>
      <SpacerDiv />
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
    </Toolbar>
    <AuthorInfo :authorid="thread.author" />
  </div>
</template>

<script lang="ts">
import { useAuth, useProfile } from '@/state/authz'
import { loveThread, unloveThread } from '@/state/threads'
import { Thread } from '@/utils/firestoreInterfaces'
import { computed, defineComponent, PropType } from 'vue'
import AuthorInfo from '../author/AuthorInfo.vue'
import Toolbar from '../layout/Toolbar.vue'
import Icon from '../material/Icon.vue'
import LoveAThreadAction from './LoveAThreadAction.vue'
import { toDisplayString } from '@/utils/firebaseTools'
import SpacerDiv from '../layout/SpacerDiv.vue'

export default defineComponent({
  name: 'ThreadBoxTailer',
  components: { AuthorInfo, LoveAThreadAction, Icon, Toolbar, SpacerDiv },
  props: {
    thread: {
      type: Object as PropType<Thread>,
      required: true
    }
  },
  setup (props) {
    const { user } = useAuth()
    const { profileMeta } = useProfile()
    const loves = computed(() => {
      if (typeof profileMeta.value.lovedThreads === 'undefined') return false
      return profileMeta.value.lovedThreads.includes(props.thread.id)
    })

    async function toggleLove () {
      // no-op if the author is trying to love their own posts
      if (props.thread.author === user.value.uid) return
      // love/unlove
      if (loves.value) {
        return unloveThread(user.value.uid, props.thread.id).then(() => {
        })
      } else {
        return loveThread(user.value.uid, props.thread.id).then(() => {
        })
      }
    }

    return { loves, toggleLove, toDisplayString }
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
