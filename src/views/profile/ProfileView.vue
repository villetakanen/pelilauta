<template>
  <div class="profileView">
    <ProfileToolbar />
    <Loader
      v-if="!loginComplete"
    />
    <div
      v-else
      class="dashBoardLayout"
    >
      <PublicProfile />
      <ProfileActions />
      <PrivateInfo v-if="false" />
      <LovedThreads />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, provide, watch } from 'vue'
import PrivateInfo from '@/components/profile/PrivateInfo.vue'
import PublicProfile from '@/components/profile/PublicProfile.vue'
import LovedThreads from '@/components/profile/LovedThreads.vue'
import ProfileActions from '@/components/profile/ProfileActions.vue'
import { useAuth, useProfile } from '@/state/authz'
import ProfileToolbar from '@/components/profile/ProfileToolbar.vue'
import Loader from '@/components/app/Loader.vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'ProfileView',
  components: {
    LovedThreads,
    ProfileActions,
    PrivateInfo,
    PublicProfile,
    ProfileToolbar,
    Loader
  },
  setup () {
    const { switchLang } = useProfile()
    const { profile, profileMeta } = useProfile()
    const { loginComplete, anonymousSession } = useAuth()
    const router = useRouter()

    provide('profileMeta', profileMeta)
    provide('publicProfile', profile)

    function setLang (lang: string) {
      switchLang(lang)
    }

    onMounted(() => {
      watch(loginComplete, (val) => {
        if (val && anonymousSession.value) router.push('/login')
      })
    })

    return { profile, setLang, loginComplete }
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
