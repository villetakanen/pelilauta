<template>
  <div class="viewThread">
    <Header
      sticky
    >
      <ViewTitle
        :icon="channelInfo.icon"
        :parent="channelInfo.name"
        :parent-route="`/threads/${thread.data.topic}`"
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
    </Header>
    <div class="singleColumnLayout richText">
      <h1 class="hideOnMobile">
        {{ thread.data.title }}
      </h1>
      <div
        v-if="thread.data.youTubeSlug"
        class="youtubePreviewFrame"
      >
        <iframe
          title="Youtube Preview"
          class="youtubePreview"
          :src="`https://www.youtube.com/embed/${thread.data.youTubeSlug}?enablejsapi=1&origin=http://example.com`"
          frameborder="0"
        />
      </div>
      <div
        class="threadContent"
        :innerHTML="thread.data.content"
      />
      <PhotoBox :photos="thread.data.images || []" />
      <ThreadBoxTailer
        :thread="thread"
      />
      <h2 class="section">
        {{ $t('threads.discussion') }}
      </h2>
      <Discussion
        :thread="thread"
        :focus-to="since"
      />
    </div>
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
    <teleport to="#ScreenBottomFabsContainer">
      <ToTopFab />
    </teleport>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import ToTopFab from '@/components/app/ToTopFab.vue'
import Discussion from '@/components/discussion/Discussion.vue'
import PhotoBox from '@/components/stream/PhotoBox.vue'
import { deleteThread, useThreads } from '@/state/threads/threads'
import ThreadBoxTailer from '@/components/thread/ThreadBoxTailer.vue'
import { getAnalytics, logEvent } from '@firebase/analytics'
import { useAuth } from '@/state/authz'
import Header from '@/components/layout/Header.vue'
import ViewTitle from '@/components/layout/ViewTitle.vue'
import Action from '@/components/material/Action.vue'
import SpacerDiv from '@/components/layout/SpacerDiv.vue'
import { useMeta } from '@/state/meta'
import MaterialMenu from '@/components/material/MaterialMenu.vue'
import { MenuItem } from '@/utils/uiInterfaces'
import { useI18n } from 'vue-i18n'
import { useSnack } from '@/composables/useSnack'
import { useUxActions } from '@/composables/useUxActions'
import Dialog from '@/components/material/Dialog.vue'
import Textfield from '@/components/form/Textfield.vue'
import Button from '@/components/form/Button.vue'

/**
 * A Router view for a Stream Thread.
 *
 * Loads all the required State entities, and initiates the required Firebase
 * subscriptions.
 * Does not contain any functionality aside from state management and component
 * import/layout
 */
export default defineComponent({
  name: 'ViewThread',
  components: {
    PhotoBox,
    Discussion,
    ToTopFab,
    ThreadBoxTailer,
    Header,
    ViewTitle,
    Action,
    SpacerDiv,
    MaterialMenu,
    Dialog,
    Textfield,
    Button
  },
  props: {
    threadid: {
      type: String,
      required: true
    },
    since: {
      type: String,
      required: false,
      default: '0'
    }
  },
  setup (props) {
    const { thread, subscribeThread } = useThreads()
    const { showExperimentalTools, showAdminTools, user } = useAuth()
    const { streams } = useMeta()
    const i18n = useI18n()
    const { pushSnack } = useSnack()
    const { reroute, copyLinkToClipboard } = useUxActions()

    subscribeThread(props.threadid)

    onMounted(() => {
      watch(() => props.threadid, (threadid) => {
        subscribeThread(threadid)
      }, { immediate: true })

      logEvent(getAnalytics(),
        'ThreadView', {
          threadid: props.threadid
        })
    })

    const channelInfo = computed(() => (streams.value.find((s) => (s.slug === thread.value.data.topic)) || { name: '', slug: '', icon: '' }))
    const showMenu = computed(() => (showAdminTools.value || thread.value.author === user.value.uid))

    const menuItems = computed(() => {
      const items = new Array<MenuItem>()
      if (thread.value.author === user.value.uid) {
        items.push({ icon: 'edit', to: `/thread/${props.threadid}/edit`, text: i18n.t('action.edit') })
        items.push({ icon: 'delete', action: drop, text: i18n.t('action.delete') })
      } else if (showAdminTools.value) {
        items.push({ icon: 'edit', to: `/thread/${props.threadid}/edit`, text: i18n.t('action.edit'), admin: true })
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
        await deleteThread(user.value.uid, props.threadid)
        pushSnack(i18n.t('stream.thread.deleteSucces'))
        reroute('/')
      } catch (error) {
        pushSnack(i18n.t('stream.thread.deleteFail'))
      }
    }

    return { thread, showExperimentalTools, channelInfo, showMenu, menuItems, toggleDelete, drop, cancelDelete, deleteThreadFromFirestore, deleteConfirm, copyLinkToClipboard }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-typography.sass

.viewThread
  div.threadContent
    p
      @include TypeBody2()
  h2.section
    @include TypeHeadline5()
    border-top: solid 1px var(--color-b-h)
    padding-top: 7px
    padding-bottom: 8px
  .youtubePreviewFrame
    width: 100%
    text-align: center
    padding: 8px
    background-color: rgba(var(--chroma-primary-c-rgba), 0.22)
    line-height: 0
    .youtubePreview
      margin: 0 auto
      padding: 0
      height: 186px
      width: 320px

</style>
