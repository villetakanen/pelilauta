<template>
  <div class="threadBoxHeader toolbar">
    <div>
      <h1>{{ thread.data.title }}</h1>
      <p class="caption">
        {{ toDisplayString(thread.created) }}
        {{ $t('threads.sinceInTopic') }}
        <router-link :to="`/stream/topic/${thread.data.topic}`">
          {{ topicName }}
        </router-link>
      </p>
    </div>
    <div class="spacer" />
    <Action
      prepend="share"
      @click="copyLink"
    >
      <span class="hideOnMobile">{{ $t('action.share') }}</span>
    </Action>
    <MaterialMenu
      v-if="canManageThread"
      v-model="menu"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { Thread, deleteThread } from '@/state/threads'
import { useMeta } from '@/state/meta'
import { toDisplayString } from '@/utils/firebaseTools'
import Action from '../material/Action.vue'
import MaterialMenu from '../material/MaterialMenu.vue'
import { useAuthState } from '@/state/authz'
import { copyUrl } from '@/utils/window'
import { useSnack } from '@/composables/useSnack'
import { useI18n } from 'vue-i18n'
import { MenuItem } from '@/utils/uiInterfaces'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'ThreadBoxHeader',
  components: { Action, MaterialMenu },
  props: {
    thread: {
      type: Object as PropType<Thread>,
      required: true
    }
  },
  setup (props) {
    const { streams } = useMeta()
    const { uid, isAdmin } = useAuthState()
    const { pushSnack } = useSnack()
    const i18n = useI18n()
    const router = useRouter()

    // Computed props
    const topicName = computed(() => {
      return streams.value.find((val) => (val.slug === props.thread.data.topic))?.name
    })
    const canManageThread = computed(() => (uid.value === props.thread.author || isAdmin.value))

    const menu = computed(() => {
      const arr = new Array<MenuItem>()

      if (canManageThread.value) {
        arr.push({ to: `/thread/${props.thread.id}/edit`, icon: 'edit', text: i18n.t('action.edit'), admin: uid.value !== props.thread.author })
        arr.push({ action: drop, icon: 'delete', text: i18n.t('action.delete'), admin: uid.value !== props.thread.author })
      }
      return arr
    })

    const drop = () => {
      deleteThread(uid.value, props.thread.id).then(() => {
        pushSnack(i18n.t('thread.deleteSuccesfull'))
        router.push('/')
      }).catch(() => {
        pushSnack(i18n.t('thread.deleteFailed'))
      })
    }

    // Functions
    const copyLink = () => {
      copyUrl()
      pushSnack({ topic: i18n.t('global.messages.linkShared') })
    }

    return { topicName, toDisplayString, canManageThread, copyLink, menu }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-typography.sass

.threadBoxHeader
  margin: 0
  max-height: 80px
  position: sticky
  position: -webkit-sticky
  top: 0px
  margin-top: -8px
  padding-top: 8px
  padding-bottom: 7px
  border-bottom: solid 1px var(--chroma-primary-g)
  margin-bottom: 8px
  background-color: var(--color-fill-background)
  z-index: 5
  h1
    @include TypeHeadline5()
    margin: 0
    overflow: hidden
    text-overflow: ellipsis
  p.caption
    @include TypeCaption()

@include media('<tablet')
  .threadBoxHeader
    height: auto
</style>
