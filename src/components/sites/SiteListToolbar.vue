<template>
  <Toolbar>
    <h3>{{ $t('wiki.title') }}</h3>
    <div class="spacer" />
    <Action
      v-if="!isAnonymous"
      to="mekanismi.profile.sites"
    >
      <span v-if="!mobile">{{ $t('wiki.mySites') }}</span>
      <template #prepend>
        <Icon name="books" />
      </template>
    </Action>
    <Action
      v-if="!isAnonymous"
      to="mekanismi.create.site"
    >
      <span v-if="!mobile">{{ $t('wiki.createSite') }}</span>
      <template #prepend>
        <Icon name="add" />
      </template>
    </Action>
  </Toolbar>
</template>

<script lang="ts">
import { useAuthState } from '@/state/authz'
import { ComputedRef, defineComponent, inject } from 'vue'
import Toolbar from '../layout/Toolbar.vue'
import Action from '../material/Action.vue'
import Icon from '../material/Icon.vue'

export default defineComponent({
  components: { Action, Icon, Toolbar },
  setup () {
    const mobile = inject('mobileViewport') as ComputedRef<boolean>
    const { isAnonymous } = useAuthState()
    return { mobile, isAnonymous }
  }
})
</script>
