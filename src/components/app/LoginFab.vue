<template>
  <Fab
    v-if="false"
    class="loginFab"
  >
    <span class="loginBG" />
    <span>{{ $t('action.login') }}</span>
    <span>{{ $t('action.register') }}</span>
  </Fab>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Fab from '../material/Fab.vue'

export default defineComponent({
  name: 'LoginFab',
  components: { Fab }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

</style>
