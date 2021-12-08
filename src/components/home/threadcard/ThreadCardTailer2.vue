<template>
  <div
    class="threadCardTailer"
    :class="{
      withSite: thread.site,
      ddColors: site && site.system === 'dd'
    }"
  >
    <div style="min-width: 64px; display: block">
      <div style="display: inline-block">
        <LoveAThreadAction
          :loves="loves"
          :count="thread.lovedCount"
          :action="toggleLove"
          :authorid="thread.author"
        />
      </div>
    </div>
    <div class="topicLink">
      {{ $t('stream.inStream') }} <router-link :to="`/threads/${thread.data.topic}`">
        {{ topicName }}
      </router-link>
    </div>
    <RepliesCardToolbarLink :thread="thread" />
  </div>
</template>

<script lang="ts">
import LoveAThreadAction from '@/components/thread/LoveAThreadAction.vue'
import { useAuth, useProfile } from '@/state/authz'
import { useMeta } from '@/state/meta'
import { Thread } from '@/utils/firestoreInterfaces'
import { loveThread, unloveThread } from '@/state/threads'
import { computed, defineComponent, PropType } from 'vue'
import RepliesCardToolbarLink from './RepliesCardToolbarLink.vue'
import { useSites } from '@/state/sites'

export default defineComponent({
  components: { RepliesCardToolbarLink, LoveAThreadAction },
  props: {
    thread: {
      type: Object as PropType<Thread>,
      required: true
    }
  },
  setup (props) {
    const { streams } = useMeta()
    const { allSites } = useSites()
    const site = computed(() => {
      if (!props.thread.site) return undefined
      return allSites.value.find((site) => (site.id === props.thread.site))
    })
    const topicName = computed(() => {
      return streams.value.find((val) => (val.slug === props.thread.data.topic))?.name
    })
    const { profileMeta } = useProfile()
    const loves = computed(() => (profileMeta.value.lovedThreads?.includes(props.thread.id)))

    const { user } = useAuth()
    async function toggleLove () {
      if (props.thread.author === user.value.uid) {
        console.warn('trying to love a thread the user is an author of')
        return
      }
      if (loves.value) return unloveThread(user.value.uid, props.thread.id)
      return loveThread(user.value.uid, props.thread.id)
    }

    return { topicName, loves, toggleLove, site }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass

.topicLink
  @include TypeCaption()
  margin: 0px 8px
  flex-grow: 1
  a
    color: var(--chroma-secondary-d)
    text-decoration: none
.threadCardTailer
  padding-top: 8px
  margin-top: 8px
  display: flex

.withSite
  background-color: var(--chroma-secondary-i)
  margin-bottom: -16px
  padding-bottom: 8px
  padding-bottom: 8px
  margin-left: -16px
  padding-left: 16px
  margin-right: -16px
  padding-right: 16px
  border-radius: 0 0 12px 12px

</style>
