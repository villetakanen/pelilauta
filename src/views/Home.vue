<template>
  <div class="contentGrid">
    <Stream />
  </div>
  <teleport to="#ScreenBottomFloatRight">
    <Fab
      v-if="isAnonymous"
      to="/login"
      :text="$t('action.login')"
      color="tertiary"
    >
      <Icon
        name="avatar"
        color="dark"
      />
    </Fab>
    <Fab
      v-if="!isAnonymous"
      id="addThreadFab"
      :action="newThread"
      :text="$t('action.addThread')"
    >
      <img
        src="@/assets/icons/add.svg"
        alt="new post"
      >
    </Fab>
  </teleport>
  <EditorDialog v-model="showEditorDialog" />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import Stream from '@/components/stream/Stream.vue'
import Fab from '@/components/material/Fab.vue'
import EditorDialog from '@/components/app/EditorDialog.vue'
import { useAuthState } from '@/state/authz'
import { useRouter } from 'vue-router'
import Icon from '@/components/material/Icon.vue'

export default defineComponent({
  name: 'Home',
  components: {
    Stream,
    Fab,
    EditorDialog,
    Icon
  },
  setup () {
    const { isAuthz, isAnonymous } = useAuthState()
    const router = useRouter()
    const editorDialog = ref(false)
    onMounted(() => {
      document.title = 'Pelilauta'
    })
    const showEditorDialog = ref(false)

    const newThread = () => {
      if (!isAuthz.value) {
        router.push('(/login')
      } else showEditorDialog.value = true
    }
    return { editorDialog, showEditorDialog, newThread, isAnonymous }
  }
})
</script>

<style lang="sass">
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

</style>
