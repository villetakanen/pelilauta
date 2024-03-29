<template>
  <div class="toolbar">
    <div>
      <h1>
        <router-link :to="`/thread/${thread.id}/view`">
          {{ thread.data.title }}
        </router-link>
      </h1>
      <p class="caption">
        <span v-if="since">{{ since }}</span>
        {{ $t('postHeader.postedInStream') }}
        <span v-if="topicName"><a :href="`/threads/${thread.data.topic}`">{{ topicName }}</a></span>
      </p>
    </div>
    <div class="spacer" />
    <div>
      <MaterialMenu v-model="menu" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { deleteThread } from '@/state/threads'
import { useMeta } from '@/state/meta'
import MaterialMenu from '@/components/material/MaterialMenu.vue'
import { useAuth } from '@/state/authz'
import { getSeconds } from '@/utils/firebaseTools'
import { MenuItem } from '@/utils/uiInterfaces'
import { Thread } from '@/utils/firestoreInterfaces'
import { Timestamp } from '@firebase/firestore'

export default defineComponent({
  name: 'ThreadCardHeader',
  components: {
    MaterialMenu
  },
  props: {
    thread: {
      type: Object as PropType<Thread>,
      required: true
    }
  },
  setup (props) {
    const i18n = useI18n()
    const { streams } = useMeta()
    const topicName = computed(() => {
      return streams.value.find((val) => (val.slug === props.thread.data.topic))?.name
    })
    // @todo: extract to /utils
    function toSince (timestamp: Timestamp|null) {
      let date = new Date(getSeconds(timestamp) * 1000)
      const now = new Date()
      const diff = (now.getTime() - date.getTime()) / 1000 / 60
      let s = ''
      if (diff < 30) s = i18n.t('since.lessThanHalfh')
      else if (diff < 120) s = i18n.t('since.lessThanTwoHours')
      else if (diff < 1440) s = i18n.t('since.lessThan24h')
      else {
        date = new Date(getSeconds(timestamp) * 1000 + 10800000)
        s = date.toISOString().substring(0, 10) + ', ' + date.toISOString().substring(11, 16)
      }
      return s
    }

    const { user, showAdminTools } = useAuth()

    function drop () {
      deleteThread(user.value.uid, props.thread.id)
    }

    const editorVisible = ref(false)

    // @TODO: add new route
    function edit () {
      console.warn('this action is missing reroute to new component')
    }

    const copyUrl = () => {
      const dummy = document.createElement('input')
      document.body.appendChild(dummy)
      dummy.value = window.location.host + '/stream/view/' + props.thread.id
      dummy.select()
      document.execCommand('copy')
      document.body.removeChild(dummy)
      // pushSnack('Success', 'Url copied to clipboard')
    }

    const menu = computed(() => {
      const arr = new Array<MenuItem>()

      // arr.push({ to: '/stream/view/' + props.threadid, text: 'Open' })
      arr.push({ action: copyUrl, text: 'Copy link', icon: 'link' })

      if (user.value.uid === props.thread.author) {
        arr.push({ action: edit, icon: 'edit', text: 'Edit' })
        arr.push({ action: drop, text: 'Delete!' })
      } else if (showAdminTools.value) {
        arr.push({ action: edit, icon: 'edit', text: 'Edit', admin: true })
        arr.push({ action: drop, text: 'Delete!', admin: true })
      }
      return arr
    })

    const since = computed(() => (toSince(props.thread.created)))
    return { since, menu, editorVisible, topicName }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.toolbar
  margin-bottom: 8px
  h1
    color: $color-fill-primary
.caption
  color: $color-font-disabled
</style>
