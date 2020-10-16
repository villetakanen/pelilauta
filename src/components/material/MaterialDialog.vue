<template>
  <transition name="fade">
    <div
      v-if="true || visible"
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
import MaterialButton from '@/components/material/MaterialButton.vue'
import { useAuthz } from '@/lib/authz'

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
    const { ssoInfo, logout, createProfile } = useAuthz()
    return { ssoInfo, logout, createProfile }
  }
})
</script>

<style lang="sass" scoped>
#material-dialog-container
  position: fixed
  z-index: 30000
</style>
