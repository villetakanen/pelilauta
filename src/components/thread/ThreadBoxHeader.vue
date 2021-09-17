<template>
  <div class="threadBoxHeader toolbar">
    <div>
      <h1>{{ thread.data.title }}</h1>
      <p class="caption">
        {{ toDisplayString(thread.created) }}
        {{ $t('threads.sinceInTopic') }}
        <span v-if="thread.site">
          <router-link :to="`/site/${thread.site}`">
            {{ siteName }}
          </router-link>
          /
        </span>
        <router-link :to="`/stream/topic/${thread.data.topic}`">
          {{ topicName }}
        </router-link>
      </p>
    </div>
    <div class="spacer" />
    <Action
      prepend="share"
      style="margin:2px"
      @click="copyLink"
    >
      <span class="hideOnMobile">{{ $t('action.share') }}</span>
    </Action>
    <MaterialMenu
      v-if="canManageThread"
      v-model="menu"
    />
    <Dialog v-model="toggleDelete">
      <Card>
        <h3>{{ $t('action.delete') }}</h3>
        <p>{{ $t('stream.thread.deleteWarning') }}</p>
        <TextField
          id="threadBoxHeaderDeleteVerifyField"
          v-model="deleteConfirm"
        />
        <div class="toolbar">
          <div class="spacer" />
          <MaterialButton
            id="threadBoxHeaderDeleteVerifyButton"
            :disabled="deleteConfirm !== 'DELETE'"
            @click="deleteThreadFromFirestore"
          >
            {{ $t('action.delete') }}
          </MaterialButton>
          <MaterialButton @click="cancelDelete">
            {{ $t('action.cancel') }}
          </MaterialButton>
        </div>
      </Card>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import { deleteThread } from '@/state/threads'
import { Thread } from '@/utils/firestoreInterfaces'
import { useMeta } from '@/state/meta'
import { toDisplayString } from '@/utils/firebaseTools'
import Action from '../material/Action.vue'
import MaterialMenu from '../material/MaterialMenu.vue'
import { useAuth } from '@/state/authz'
import { copyUrl } from '@/utils/window'
import { useSnack } from '@/composables/useSnack'
import { useI18n } from 'vue-i18n'
import { MenuItem } from '@/utils/uiInterfaces'
import router from '@/router'
import Card from '../layout/Card.vue'
import TextField from '../material/TextField.vue'
import MaterialButton from '../material/MaterialButton.vue'
import Dialog from '../material/Dialog.vue'
import { useSites } from '@/state/sites'
import { toSite } from '@/state/site'

export default defineComponent({
  name: 'ThreadBoxHeader',
  components: { Action, MaterialMenu, Card, TextField, MaterialButton, Dialog },
  props: {
    thread: {
      type: Object as PropType<Thread>,
      required: true
    }
  },
  setup (props) {
    const { streams } = useMeta()
    const { user, showAdminTools } = useAuth()
    const { pushSnack } = useSnack()
    const i18n = useI18n()

    // Computed props
    const topicName = computed(() => {
      return streams.value.find((val) => (val.slug === props.thread.data.topic))?.name
    })
    const canManageThread = computed(() => (user.value.uid === props.thread.author || showAdminTools.value))

    const menu = computed(() => {
      const arr = new Array<MenuItem>()

      if (canManageThread.value) {
        arr.push({ to: `/thread/${props.thread.id}/edit`, icon: 'edit', text: i18n.t('action.edit'), admin: user.value.uid !== props.thread.author })
        arr.push({ action: drop, icon: 'delete', text: i18n.t('action.delete'), admin: user.value.uid !== props.thread.author })
      }
      return arr
    })

    // Functions
    const copyLink = () => {
      copyUrl()
      pushSnack({ topic: i18n.t('global.messages.linkShared') })
    }

    // Deleting a thead.
    // Note: as thread deletion deletes discussion too, we want to verify the deletion.
    const toggleDelete = ref(false)
    const deleteConfirm = ref('')
    const drop = () => {
      toggleDelete.value = true
    }
    const cancelDelete = () => {
      toggleDelete.value = false
    }
    const deleteThreadFromFirestore = async () => {
      if (deleteConfirm.value !== 'DELETE') return
      try {
        await deleteThread(user.value.uid, props.thread.id)
        pushSnack(i18n.t('stream.thread.deleteSucces'))
        router.push('/')
      } catch (error) {
        pushSnack(i18n.t('stream.thread.deleteFail'))
      }
    }

    const siteName = computed(() => {
      if (!props.thread.site) return ''
      const { allSites } = useSites()
      return (allSites.value.find((s) => (s.id === props.thread.site)) ?? toSite())?.name
    })

    return { topicName, toDisplayString, canManageThread, copyLink, menu, deleteConfirm, deleteThreadFromFirestore, toggleDelete, cancelDelete, siteName }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-typography.sass

.threadBoxHeader
  margin: 0
  position: sticky
  position: -webkit-sticky
  top: 0px
  margin-top: -16px
  padding-top: 12px
  padding-bottom: 7px
  border-bottom: solid 1px var(--color-b-h)
  margin-bottom: 8px
  z-index: 5
  background-color: white
  h1
    @include TypeHeadline5()
    margin: 0
    overflow: hidden
    text-overflow: ellipsis
    color: var(--color-a-b)
  p.caption
    @include TypeCaption()

@include media('<tablet')
  .threadBoxHeader
    height: auto
    margin-left: -16px
    padding-left: 16px
    margin-right: -16px
    padding-right: 4px
    background-color: var(--color-b-j)
</style>
