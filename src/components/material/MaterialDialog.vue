<template>
  <transition name="fade">
    <div
      v-if="visible"
      id="material-dialog-container"
    >
      <div id="material-dialog">
        <h3>Welcome to Pelilauta.web.app</h3>
        <p>
          To continue, we need to create a local profile for you. To do that – we need to pull
          the following info from your login provider and save it here:
        </p>
        <div class="infoBox">
          <img
            class="avatar"
            alt="avatar"
            :src="ssoInfo.photoURL"
          >
          <p>{{ ssoInfo.displayName }}</p>
          <p>{{ ssoInfo.email }} &nbsp; </p>
        </div>
        <p>
          You can erase your profile data any time by deleting your user account from
          <a href="https://mekanismi.web.app">mekanismi.web.app.</a>
        </p>
        <div class="actionBar">
          <MaterialButton
            text
            :action="logout"
          >
            Cancel
          </MaterialButton>
          <MaterialButton :action="createProfile">
            Continue as {{ ssoInfo.displayName }}
          </MaterialButton>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import MaterialButton from '@/components/material/MaterialButton.vue'
import { useProfile } from '@/state/authz'
import { getAuth } from '@firebase/auth'

export default defineComponent({
  components: {
    MaterialButton
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  setup () {
    const auth = getAuth()
    const { createProfile } = useProfile()
    const ssoInfo = ref({
      displayName: auth.currentUser?.displayName,
      email: auth.currentUser?.email,
      photoURL: auth.currentUser?.photoURL
    })
    const router = useRouter()

    function logout () {
      auth.signOut().then(() => {
        router.push('/')
      })
    }

    return { ssoInfo, createProfile, logout }
  }
})
</script>

<style lang="sass" scoped>
#material-dialog-container
  position: fixed
  z-index: 30000
</style>
