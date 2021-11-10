<template>
  <Header
    id="ThreadHeader"
    sticky
  >
    <ViewTitle
      :icon="topic.icon"
      :parent="topic.name"
      :parent-route="`/threads/${topic.slug}`"
    >
      {{ thread.data.title }}
    </ViewTitle>
    <SpacerDiv />
    <Action
      prepend="share"
      @click="copyLinkToClipboard"
    >
      {{ $t('action.share') }}
    </Action>
    <MaterialMenu
      v-if="showMenu"
      v-model="menuItems"
    />
    <Dialog v-model="toggleDelete">
      <h3>{{ $t('action.delete') }}</h3>
      <p>{{ $t('stream.thread.deleteWarning') }}</p>
      <Textfield
        id="threadBoxHeaderDeleteVerifyField"
        v-model="deleteConfirm"
      />
      <div class="toolbar">
        <div class="spacer" />
        <Button
          id="threadBoxHeaderDeleteVerifyButton"
          :disabled="deleteConfirm !== 'DELETE'"
          @click="deleteThreadFromFirestore"
        >
          {{ $t('action.delete') }}
        </Button>
        <Button @click="cancelDelete">
          {{ $t('action.cancel') }}
        </Button>
      </div>
    </Dialog>
  </Header>
</template>

<script lang="ts">
import { useSnack } from '@/composables/useSnack'
import { useUxActions } from '@/composables/useUxActions'
import { useAuth } from '@/state/authz'
import { useMeta } from '@/state/meta'
import { deleteThread, ThreadClass } from '@/state/threads/threads'
import { MenuItem } from '@/utils/uiInterfaces'
import { computed, defineComponent, PropType, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '../form/Button.vue'
import Textfield from '../form/Textfield.vue'
import Header from '../layout/Header.vue'
import SpacerDiv from '../layout/SpacerDiv.vue'
import ViewTitle from '../layout/ViewTitle.vue'
import Action from '../material/Action.vue'
import Dialog from '../material/Dialog.vue'
import MaterialMenu from '../material/MaterialMenu.vue'

export default defineComponent({
  components: { Header, ViewTitle, Action, MaterialMenu, SpacerDiv, Dialog, Textfield, Button },
  props: {
    thread: {
      type: Object as PropType <ThreadClass>,
      required: true
    }
  },
  setup (props) {
    const { getTopic } = useMeta()
    const topic = computed(() => getTopic(props.thread))
    const { showAdminTools, user } = useAuth()
    const i18n = useI18n()
    const { pushSnack } = useSnack()
    const { reroute, copyLinkToClipboard } = useUxActions()

    const menuItems = computed(() => {
      const items = new Array<MenuItem>()
      if (props.thread.author === user.value.uid) {
        items.push({ icon: 'edit', to: `/thread/${props.thread.id}/edit`, text: i18n.t('action.edit') })
        items.push({ icon: 'delete', action: drop, text: i18n.t('action.delete') })
      } else if (showAdminTools.value) {
        items.push({ icon: 'edit', to: `/thread/${props.thread.id}/edit`, text: i18n.t('action.edit'), admin: true })
        items.push({ icon: 'delete', action: drop, text: i18n.t('action.delete'), admin: true })
      }
      return items
    })

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
        reroute('/')
      } catch (error) {
        pushSnack(i18n.t('stream.thread.deleteFail'))
      }
    }

    const showMenu = computed(() => (showAdminTools.value || props.thread.author === user.value.uid))

    return { topic, menuItems, toggleDelete, drop, cancelDelete, deleteThreadFromFirestore, deleteConfirm, showMenu, reroute, copyLinkToClipboard }
  }
})
</script>
