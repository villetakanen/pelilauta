<template>
  <div class="toolbar">
    <div class="spacer" />
    <!-- MaterialButton text>
      {{ $t('actions.forgetMe') }}
    </MaterialButton-->
    <MaterialButton :action="logout">
      {{ $t('action.logout') }}
    </MaterialButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import { useRouter } from 'vue-router'
// import { useAuthState } from '@/state/authz'
import firebase from 'firebase/app'
import 'firebase/auth'

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

    return { logout }
  }
})
</script>
