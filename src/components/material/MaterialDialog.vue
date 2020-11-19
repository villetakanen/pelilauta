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
            :src="ssoInfo.photoUrl"
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
import { defineComponent } from 'vue'
import firebase from 'firebase/app'
import { useRouter } from 'vue-router'
import { useAuthz } from '@/lib/authz'
import MaterialButton from '@/components/material/MaterialButton.vue'

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
    const { ssoInfo, createProfile } = useAuthz()
    const router = useRouter()

    function logout () {
      firebase.auth().signOut().then(() => {
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
