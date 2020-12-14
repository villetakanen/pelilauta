<template>
  <div class="contentGrid">
    <Stream />
  </div>
  <teleport to="body">
    <Fab
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

export default defineComponent({
  name: 'Home',
  components: {
    Stream,
    Fab,
    EditorDialog
  },
  setup () {
    const { isAuthz } = useAuthState()
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
    return { editorDialog, showEditorDialog, newThread }
  }
})
</script>

<style lang="sass">
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

#addThreadFab
  @include BoxShadow8()
  position: fixed
  left: 50%
  transform: translateX(-50%)
  bottom: 16px
</style>
