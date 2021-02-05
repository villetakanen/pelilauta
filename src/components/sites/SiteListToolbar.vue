<template>
  <Toolbar>
    <h3>{{ $t('wiki.title') }}</h3>
    <div class="spacer" />
    <Action
      v-if="!isAnonymous"
      to="mekanismi.profile.sites"
      prepend="books"
    >
      <span v-if="!mobile">{{ $t('wiki.mySites') }}</span>
    </Action>
    <Action
      v-if="!isAnonymous"
      to="mekanismi.create.site"
      prepend="add"
    >
      <span v-if="!mobile">{{ $t('wiki.createSite') }}</span>
    </Action>
  </Toolbar>
</template>

<script lang="ts">
import { useAuthState } from '@/state/authz'
import { ComputedRef, defineComponent, inject } from 'vue'
import Toolbar from '../layout/Toolbar.vue'
import Action from '../material/Action.vue'

export default defineComponent({
  components: { Action, Toolbar },
  setup () {
    const mobile = inject('mobileViewport') as ComputedRef<boolean>
    const { isAnonymous } = useAuthState()
    return { mobile, isAnonymous }
  }
})
</script>
