<template>
  <div class="profileView">
    <ProfileToolbar />
    <div class="singleColumnLayout">
      <PublicProfile />
      <ProfileActions />
      <PrivateInfo v-if="false" />
      <LovedThreads />
    </div>
  </div>
</template>

<script lang="ts">
import { ComputedRef, defineComponent, inject, onMounted, provide } from 'vue'
import PrivateInfo from '@/components/profile/PrivateInfo.vue'
import PublicProfile from '@/components/profile/PublicProfile.vue'
import LovedThreads from '@/components/profile/LovedThreads.vue'
import ProfileActions from '@/components/profile/ProfileActions.vue'
import { useProfile } from '@/state/authz'
import { useSnack } from '@/composables/useSnack'
import ProfileToolbar from '@/components/profile/ProfileToolbar.vue'

export default defineComponent({
  name: 'ProfileView',
  components: {
    LovedThreads,
    ProfileActions,
    PrivateInfo,
    PublicProfile,
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
