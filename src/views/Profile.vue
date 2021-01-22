<template>
  <h1 class="viewHeader">
    {{ profile.nick }}
  </h1>
  <div class="contentGrid">
    <ProfileCard />
    <MaterialCard>
      <img
        v-if="profile.photoURL"
        class="avatar"
        :src="profile.photoURL"
        :alt="profile.nick"
      >
      <div>
        {{ $t('language.label') }} <a @click="setLang('en')">EN</a> / <a @click="setLang('fi')">FI</a>
      </div>
      <div style="clear:both" />
    </MaterialCard>
    <PublicProfile />
    <PrivateInfo v-if="false" />
    <LovedThreads />
    <ProfileActions />
  </div>
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import PrivateInfo from '@/components/profile/PrivateInfo.vue'
import PublicProfile from '@/components/profile/PublicProfile.vue'
import LovedThreads from '@/components/profile/LovedThreads.vue'
import ProfileActions from '@/components/profile/ProfileActions.vue'
import { useAuthz } from '@/lib/authz'
import { useProfile } from '@/state/authz'
import ProfileCard from '@/components/profile/ProfileCard.vue'

export default defineComponent({
  name: 'ProfileView',
  components: {
    MaterialCard,
    LovedThreads,
    ProfileActions,
    PrivateInfo,
    PublicProfile,
    ProfileCard
  },
  setup () {
    const { switchLang } = useAuthz()
    const { profile, profileMeta } = useProfile()

    provide('profileMeta', profileMeta)
    provide('publicProfile', profile)

    function setLang (lang: string) {
      switchLang(lang)
    }

    return { profile, setLang }
  }
})
</script>

<style lang="sass" scoped>
img.avatar
  float: left
  max-width: 122px
  max-height: 122px
  border-radius: 50%
  margin-right: 8px

</style>
