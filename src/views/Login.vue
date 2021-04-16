<template>
  <Toolbar>
    <h3>{{ $t('login.title') }}</h3>
  </Toolbar>
  <div class="contentGrid">
    <EmailLoginForm />
    <MaterialCard class="main-view">
      <p>{{ $t('login.message') }}</p>
      <div class="loginButton">
        <MaterialButton
          :action="socialGoogleLogin"
          class="googleLoginButton"
        >
          <img
            src="../assets/google.svg"
            alt="G"
            class="icon"
          > {{ $t('login.withGoogleButton') }}
        </MaterialButton>
      </div>
      <div class="loginButton">
        <MaterialButton
          :action="socialFacebookLogin"
          class="facebookLoginButton"
        >
          <img
            src="../assets/facebook.svg"
            alt="F"
            class="icon"
          > {{ $t('login.withFacebookButton') }}
        </MaterialButton>
      </div>
    </MaterialCard>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/analytics'
import MaterialCard from '@/components/material/MaterialCard.vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import { useRouter } from 'vue-router'
import Toolbar from '@/components/layout/Toolbar.vue'
import EmailLoginForm from '@/components/auth/EmailLoginForm.vue'

export default defineComponent({
  components: {
    MaterialButton,
    MaterialCard,
    Toolbar,
    EmailLoginForm
  },
  setup () {
    const router = useRouter()

    function socialGoogleLogin () {
      const provider = new firebase.auth.GoogleAuthProvider()
      provider.addScope('email')
      firebase.auth().signInWithPopup(provider).then(() => {
        firebase.analytics().logEvent('Login', { vendor: 'Google' })
        router.push('/')
      })
    }

    function socialFacebookLogin () {
      const provider = new firebase.auth.FacebookAuthProvider()
      provider.addScope('email')
      firebase.auth().signInWithPopup(provider).then(() => {
        firebase.analytics().logEvent('Login', { vendor: 'Facebook' })
        router.push('/')
      })
    }

    return { socialGoogleLogin, socialFacebookLogin }
  }
})
</script>

<style lang="sass">
#app
  .loginButton
    padding: 8px
    margin: 0 auto
    text-align: center
  .googleLoginButton
    background-color: white
    color: #666
    width: 230px
    text-align: left

  .facebookLoginButton
    background-color: #4267B2
    color: rgba(255,255,255,0.8)
    width: 230px
    text-align: left

</style>
