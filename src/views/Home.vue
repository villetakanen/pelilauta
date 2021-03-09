<template>
  <div class="contentGrid">
    <HomeStream />
  </div>
  <teleport to="#ScreenBottomFloatRight">
    <Fab
      v-if="!isAnonymous"
      id="addThreadFab"
      to="/stream/post/new"
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
import Fab from '@/components/material/Fab.vue'
import EditorDialog from '@/components/app/EditorDialog.vue'
import { useAuthState } from '@/state/authz'
import { useRouter } from 'vue-router'
import HomeStream from '@/components/home/HomeStream.vue'

export default defineComponent({
  name: 'Home',
  components: {
    Fab,
    EditorDialog,
    HomeStream
  },
  setup () {
    const { isAnonymous } = useAuthState()
    const router = useRouter()
    const editorDialog = ref(false)
    onMounted(() => {
      document.title = 'Pelilauta'
    })
    const showEditorDialog = ref(false)

    const newThread = () => {
      if (isAnonymous.value) {
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
