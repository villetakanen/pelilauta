<template>
  <div class="profileActions">
    <h3>{{ $t('profile.actions.title') }}</h3>
    <p>{{ $t('profile.actions.helper') }}</p>
    <MaterialButton
      :action="stampAllSeen"
    >
      {{ $t('action.markAllRead') }}
    </MaterialButton>
    <div class="toolbar">
      <div class="spacer" />
      <MaterialButton
        text
        :action="logout"
      >
        {{ $t('action.logout') }}
      </MaterialButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import { useRouter } from 'vue-router'
import firebase from 'firebase/app'
import 'firebase/auth'
import { useProfile } from '@/state/authz'

export default defineComponent({
  name: 'ProfileActions',
  components: {
    MaterialButton
  },
  setup () {
    const router = useRouter()

    const logout = () => {
      firebase.auth().signOut().then(() => {
        router.push('/')
      })
    }

    function stampAllSeen () {
      const { markAllThreadsRead } = useProfile()
      markAllThreadsRead()
    }

    return { logout, stampAllSeen }
  }
})
</script>
