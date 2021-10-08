<template>
  <section class="socialAuthCard chroma-box-2">
    <h1 class="title">
      {{ $t('login.socialLoginTitle') }}
    </h1>
    <p>{{ $t('login.message') }}</p>
    <div class="loginButton">
      <Button
        tertiary
        class="googleLoginButton"
        @click="socialGoogleLogin"
      >
        <img
          src="@/assets/google.svg"
          alt="G"
          class="icon"
        > {{ $t('login.withGoogleButton') }}
      </Button>
    </div>
    <div class="loginButton">
      <Button
        class="facebookLoginButton"
        @click="socialFacebookLogin"
      >
        <img
          src="@/assets/facebook.svg"
          alt="F"
          class="icon"
        > {{ $t('login.withFacebookButton') }}
      </Button>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { FacebookAuthProvider, getAuth, GoogleAuthProvider, signInWithPopup } from '@firebase/auth'
import { getAnalytics, logEvent } from '@firebase/analytics'
import Button from '../form/Button.vue'

export default defineComponent({
  name: 'SocialAuthCard',
  components: { Button },
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
@import @/styles/include-media.scss

.socialAuthCard
  box-sizing: border-box
  padding: 16px

.loginButton
  margin: 0 auto
  text-align: center
  margin-bottom: 4px

button.tertiary.googleLoginButton
  background-color: var(--chroma-clear)
  color: var(--chroma-secondary-a)
  width: 192px
  padding-left: 40px
  position: relative
  text-align: left
  img.icon
    height: 24px
    position: absolute
    top: 8px
    left: 8px

button.facebookLoginButton
  background-color: #4267B2 // The FB blue
  color: var(--chroma-clear)
  width: 192px
  padding-left: 40px
  position: relative
  text-align: left
  img.icon
    height: 20px
    position: absolute
    top: 9px
    left: 10px

@include media('<tablet')
  button.tertiary.googleLoginButton,
  button.facebookLoginButton
    width: 100%
    text-align: center
    padding-left: 12px
</style>
