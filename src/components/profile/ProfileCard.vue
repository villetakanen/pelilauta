<template>
  <MaterialCard>
    <div v-if="publicProfile && publicProfile.nick">
      <h1>{{ publicProfile.nick }}</h1>
      <MaterialButton
        text
        :action="stampAllSeen"
      >
        {{ $t('actions.markAllRead') }}
      </MaterialButton>
      <div style="font-size:8px; opacity: 0.5">
        {{ profileMeta }}
      </div>
    </div>
    <Loader v-else />
  </MaterialCard>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import { ProfileMeta, PublicProfile, useProfile } from '@/state/authz'
import Loader from '@/components/app/Loader.vue'
import MaterialButton from '../material/MaterialButton.vue'

export default defineComponent({
  name: 'ProfileView',
  components: {
    MaterialCard,
    Loader,
    MaterialButton
  },
  setup () {
    const profileMeta = inject('profileMeta') as ProfileMeta
    const publicProfile = inject('publicProfile') as PublicProfile

    function stampAllSeen () {
      const { markAllThreadsRead } = useProfile()
      markAllThreadsRead()
    }

    return { profileMeta, publicProfile, stampAllSeen }
  }
})
</script>
