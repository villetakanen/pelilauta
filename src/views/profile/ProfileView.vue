<template>
  <div class="profileView">
    <ProfileToolbar />
    <div class="singleColumnLayout">
      <PublicProfile />
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
      <PrivateInfo v-if="false" />
      <LovedThreads />
      <ProfileActions />
    </div>
  </div>
</template>

<script lang="ts">
import { ComputedRef, defineComponent, inject, onMounted, provide } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import PrivateInfo from '@/components/profile/PrivateInfo.vue'
import PublicProfile from '@/components/profile/PublicProfile.vue'
import LovedThreads from '@/components/profile/LovedThreads.vue'
import ProfileActions from '@/components/profile/ProfileActions.vue'
import { useProfile } from '@/state/authz'
import ProfileCard from '@/components/profile/ProfileCard.vue'
import { useSnack } from '@/composables/useSnack'
import ProfileToolbar from '@/components/profile/ProfileToolbar.vue'

export default defineComponent({
  name: 'ProfileView',
  components: {
    MaterialCard,
    LovedThreads,
    ProfileActions,
    PrivateInfo,
    PublicProfile,
    ProfileCard,
    ProfileToolbar
  },
  setup () {
    const { switchLang } = useProfile()
    const { profile, profileMeta, createProfile } = useProfile()
    const mobile = inject('mobileViewPort') as ComputedRef<boolean>
    const { pushSnack } = useSnack()

    provide('profileMeta', profileMeta)
    provide('publicProfile', profile)

    function setLang (lang: string) {
      switchLang(lang)
    }

    onMounted(() => {
      console.log(profile.value)
      if (!profile.value || !profile.value.nick) {
        pushSnack({ topic: 'Initializing a profile' })
        createProfile().then(() => {
          pushSnack({ topic: 'Profile initialized' })
        }).catch((error: Error) => {
          pushSnack({ topic: error.message })
        })
      }
    })

    return { profile, setLang, mobile }
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
