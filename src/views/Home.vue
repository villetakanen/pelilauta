<template>
  <div class="contentGrid">
    <HomeStream />
  </div>
  <teleport to="#BottomFabsContainer">
    <Fab
      v-if="!isAnonymous"
      id="addThreadFab"
      to="/stream/add/thread"
      :text="$t('action.addThread')"
    >
      <img
        src="@/assets/icons/add.svg"
        alt="new post"
      >
    </Fab>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import Fab from '@/components/material/Fab.vue'
import { useAuthState } from '@/state/authz'
import HomeStream from '@/components/home/HomeStream.vue'

export default defineComponent({
  name: 'Home',
  components: {
    Fab,
    HomeStream
  },
  setup () {
    const { isAnonymous } = useAuthState()
    const editorDialog = ref(false)
    onMounted(() => {
      document.title = 'Pelilauta'
    })

    return { editorDialog, isAnonymous }
  }
})
</script>

<style lang="sass">
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

</style>
