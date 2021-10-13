<template>
  <Header>
    <ViewTitle>
      <router-link :to="`/profile`">
        {{ profile.nick }}
      </router-link>
    </ViewTitle>
    <SpacerDiv />
    <Action
      :to="'/u/' + user.uid"
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
      <span class="hideOnMobile">{{ $t('sideNav.toMySitesLink') }}</span>
    </Action>
  </Header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Action from '../material/Action.vue'
import { useAuth, useProfile } from '@/state/authz'
import Header from '../layout/Header.vue'
import SpacerDiv from '../layout/SpacerDiv.vue'
import ViewTitle from '../layout/ViewTitle.vue'

export default defineComponent({
  components: { Action, Header, SpacerDiv, ViewTitle },
  setup () {
    const { user } = useAuth()
    const { profile, profileMeta } = useProfile()
    return { user, profile, profileMeta }
  }
})
</script>
