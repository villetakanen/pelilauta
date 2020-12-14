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
import { useMeta } from '@/lib/meta'
import Fab from '@/components/material/Fab.vue'
import EditorDialog from '@/components/app/EditorDialog.vue'

export default defineComponent({
  name: 'Home',
  components: {
    Stream,
    Fab,
    EditorDialog
  },
  setup () {
    const { showStreamActions } = useMeta()
    const editorDialog = ref(false)
    onMounted(() => {
      document.title = 'Pelilauta'
    })
    const showEditorDialog = ref(false)

    const newThread = () => {
      console.log('newThread')
      showEditorDialog.value = true
    }
    return { showStreamActions, editorDialog, showEditorDialog, newThread }
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
