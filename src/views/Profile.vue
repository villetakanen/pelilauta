<template>
  <h1 class="viewHeader">
    {{ profile.nick }}
  </h1>
  <div class="contentGrid">
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
import { defineComponent } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import PrivateInfo from '@/components/profile/PrivateInfo.vue'
import PublicProfile from '@/components/profile/PublicProfile.vue'
import LovedThreads from '@/components/profile/LovedThreads.vue'
import ProfileActions from '@/components/profile/ProfileActions.vue'
import { useAuthz } from '@/lib/authz'

export default defineComponent({
  name: 'Home',
  components: {
    MaterialCard,
    LovedThreads,
    ProfileActions,
    PrivateInfo,
    PublicProfile
  },
  setup () {
    const { profile, switchLang } = useAuthz()

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
