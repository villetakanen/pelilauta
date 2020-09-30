<template>
  <div class="main-view">
    <p>Please login or register to Pelilauta with the buttons below.</p>
    <div style="text-align: center">
      <MaterialButton
        :action="socialGoogleLogin"
        class="googleLoginButton"
      >
        <img
          src="../assets/google.svg"
          alt="G"
          class="icon"
        > Login with Google
      </MaterialButton>
    </div>
    <div style="text-align: center">
      <MaterialButton
        :action="socialFacebookLogin"
        class="facebookLoginButton"
      >
        <img
          src="../assets/facebook.svg"
          alt="F"
          class="icon"
        > Login with Facebook
      </MaterialButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import * as firebase from 'firebase/app'
import 'firebase/auth'
import MaterialButton from '../components/material/MaterialButton.vue'

export default defineComponent({
  components: {
    MaterialButton
  },
  setup () {
    function socialGoogleLogin () {
      const provider = new firebase.auth.GoogleAuthProvider()
      provider.addScope('email')
      firebase.auth().signInWithPopup(provider)
    }

    function socialFacebookLogin () {
      const provider = new firebase.auth.FacebookAuthProvider()
      provider.addScope('email')
      firebase.auth().signInWithPopup(provider)
    }

    return { socialGoogleLogin, socialFacebookLogin }
  }
})
</script>

<style lang="sass">
#app
  .googleLoginButton
    background-color: white
    color: #666
    width: 240px
    text-align: left

  .facebookLoginButton
    background-color: #4267B2
    color: rgba(255,255,255,0.8)
    width: 240px
    text-align: left

</style>
