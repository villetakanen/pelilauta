<template>
  <Header>
    <ViewTitle>
      <router-link :to="`/profile`">
        {{ profile.nick }}
      </router-link>
    </ViewTitle>
    <SpacerDiv />
    <Button
      text
      @click.prevent="reroute('/u/' + user.uid)"
    >
      <Icon
        name="stats"
        small
      />
      <span class="hideOnMobile">{{ $t('profile.stats') }}</span>
    </Button>
    <Button
      text
      @click.prevent="reroute('profile.media')"
    >
      <Icon
        name="images"
        small
      />
      <span class="hideOnMobile">{{ $t('profile.assets') }}</span>
    </Button>
    <Button
      text
      @click.prevent="reroute('mekanismi.profile.sites')"
    >
      <Icon
        name="books"
        small
      />
      <span class="hideOnMobile">{{ $t('sideNav.toMySitesLink') }}</span>
    </Button>
  </Header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuth, useProfile } from '@/state/authz'
import Header from '../layout/Header.vue'
import SpacerDiv from '../layout/SpacerDiv.vue'
import ViewTitle from '../layout/ViewTitle.vue'
import Button from '../form/Button.vue'
import Icon from '../material/Icon.vue'
import { useUxActions } from '@/composables/useUxActions'

export default defineComponent({
  components: { Button, Header, SpacerDiv, ViewTitle, Icon },
  setup () {
    const { user } = useAuth()
    const { profile, profileMeta } = useProfile()
    const { reroute } = useUxActions()
    return { user, profile, profileMeta, reroute }
  }
})
</script>
