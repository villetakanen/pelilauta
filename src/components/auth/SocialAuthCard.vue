<template>
  <Card>
    <h1 class="title">
      {{ $t('login.socialLoginTitle') }}
    </h1>
    <p>{{ $t('login.message') }}</p>
    <div class="loginButton">
      <MaterialButton
        :action="socialGoogleLogin"
        class="googleLoginButton"
      >
        <img
          src="@/assets/google.svg"
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
          src="@/assets/facebook.svg"
          alt="F"
          class="icon"
        > {{ $t('login.withFacebookButton') }}
      </MaterialButton>
    </div>
  </Card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Card from '@/components/layout/Card.vue'
import { useRouter } from 'vue-router'
import MaterialButton from '../material/MaterialButton.vue'
import { FacebookAuthProvider, getAuth, GoogleAuthProvider, signInWithPopup } from '@firebase/auth'
import { getAnalytics, logEvent } from '@firebase/analytics'

export default defineComponent({
  name: 'SocialAuthCard',
  components: { Card, MaterialButton },
  setup () {
    const router = useRouter()

    function socialGoogleLogin () {
      const provider = new GoogleAuthProvider()
      provider.addScope('email')
      signInWithPopup(getAuth(), provider).then(() => {
        logEvent(getAnalytics(), 'Login', { vendor: 'Google' })
        router.push('/')
      })
    }

    function socialFacebookLogin () {
      const provider = new FacebookAuthProvider()
      provider.addScope('email')
      signInWithPopup(getAuth(), provider).then(() => {
        logEvent(getAnalytics(), 'Login', { vendor: 'Facebook' })
        router.push('/')
      })
    }

    return { socialGoogleLogin, socialFacebookLogin }
  }
})
</script>

<style lang="sass" scoped>
.loginButton
  margin: 0 auto
  text-align: center
.googleLoginButton
  background-color: var(--chroma-clear)
  color: var(--chroma-secondary-a)
  width: 192px
  padding-left: 36px
  position: relative
  text-align: left
.facebookLoginButton
  background-color: #4267B2 // The FB blue
  color: var(--chroma-clear)
  width: 192px
  padding-left: 36px
  position: relative
  text-align: left
.icon
  position: absolute
  top: 5px
  left: 9px
/* #app
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
    text-align: left */
</style>
