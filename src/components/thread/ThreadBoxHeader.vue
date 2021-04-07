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
import router from '@/router'
import Card from '../layout/Card.vue'
import TextField from '../material/TextField.vue'
import MaterialButton from '../material/MaterialButton.vue'
import Dialog from '../material/Dialog.vue'

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
    const { uid, isAdmin } = useAuthState()
    const { pushSnack } = useSnack()
    const i18n = useI18n()

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
      console.debug('deleting thread')
      try {
        await deleteThread(uid.value, props.thread.id)
        pushSnack(i18n.t('stream.thread.deleteSucces'))
        router.push('/')
      } catch (error) {
        console.debug(error)
        pushSnack(i18n.t('stream.thread.deleteFail'))
      }
    }

    return { topicName, toDisplayString, canManageThread, copyLink, menu, deleteConfirm, deleteThreadFromFirestore, toggleDelete, cancelDelete }
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
  top: 24px
  margin-top: -16px
  padding-top: 12px
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
