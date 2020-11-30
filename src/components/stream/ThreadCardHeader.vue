<template>
  <div class="toolbar">
    <div>
      <h1>
        <router-link :to="'/stream/view/' + thread.id">
          {{ thread.data.title }}
        </router-link>
      </h1>
      <p class="caption">
        <span v-if="since">{{ since }}</span>
      </p>
    </div>
    <div class="spacer" />
    <div>
      <MaterialMenu v-model="menu" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { Thread, deleteThread } from '@/state/threads'
import { MenuItem, useMeta } from '@/lib/meta'
import MaterialMenu from '@/components/material/MaterialMenu.vue'
import { useAuthState } from '@/state/authz'
import { useEditorDialog } from '@/lib/editor'
// import MaterialCard from '@/components/material/MaterialCard.vue'

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
    // @todo: extract to /utils
    function toSince (timestamp: firebase.firestore.Timestamp) {
      let date = new Date(timestamp.seconds * 1000)
      const now = new Date()
      const diff = (now.getTime() - date.getTime()) / 1000 / 60
      let s = ''
      if (diff < 30) s = i18n.t('since.lessThanHalfh')
      else if (diff < 120) s = i18n.t('since.lessThanTwoHours')
      else if (diff < 1440) s = i18n.t('since.lessThan24h')
      else {
        date = new Date(timestamp.seconds * 1000 + 10800000)
        s = date.toISOString().substring(0, 10) + ', ' + date.toISOString().substring(11, 16)
      }
      return s
    }

    const { uid } = useAuthState()
    const { isAdmin } = useMeta()

    function drop () {
      deleteThread(uid.value, props.thread.id)
    }

    function edit () {
      const { showEditor } = useEditorDialog()
      showEditor(props.thread)
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

      if (uid.value === props.thread.author) {
        arr.push({ action: edit, icon: 'edit', text: 'Edit' })
        arr.push({ action: drop, text: 'Delete!' })
      } else if (isAdmin(uid.value) || uid.value === props.thread.author) {
        arr.push({ action: edit, icon: 'edit', text: 'Edit', admin: true })
        arr.push({ action: drop, text: 'Delete!', admin: true })
      }
      return arr
    })

    const since = computed(() => (toSince(props.thread.created)))
    return { since, menu }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.toolbar
  margin-bottom: 16px
  h1
    color: $color-fill-primary
.caption
  color: $color-font-disabled
</style>
