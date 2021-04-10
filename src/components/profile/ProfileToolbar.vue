<template>
  <Toolbar>
    <h3 class="clipWithEllipsis">
      <router-link :to="`/profile`">
        {{ profile.nick }}
      </router-link>
    </h3>
    <div class="spacer" />
    <Action
      :to="'/u/' + uid"
      prepend="stats"
    >
      <span class="hideOnMobile">{{ $t('profile.stats') }}</span>
    </Action>
    <Action
      to="profile.media"
      prepend="images"
    >
      <span class="hideOnMobile">{{ $t('profile.assets') }}</span>
    </Action>
    <Action
      to="mekanismi.profile.sites"
      prepend="books"
    >
      <span class="hideOnMobile">{{ $t('wiki.mySites') }}</span>
    </Action>
  </Toolbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Toolbar from '../layout/Toolbar.vue'
import Action from '../material/Action.vue'
import { useAuthState, useProfile } from '@/state/authz'

export default defineComponent({
  components: { Toolbar, Action },
  setup () {
    const { uid } = useAuthState()
    const { profile, profileMeta } = useProfile()
    return { uid, profile, profileMeta }
  }
})
</script>
