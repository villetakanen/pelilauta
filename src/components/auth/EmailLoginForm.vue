<template>
  <section class="emailLoginForm">
    <div
      v-if="verify"
      class="verifyWarning"
    >
      {{ $t('login.verifyEmailLoginMessage') }}
    </div>
    <div v-else>
      <h3>
        {{ $t('login.emailLoginTitle') }}
      </h3>
      <p>
        {{ $t('login.emailLoginInfo') }}
      </p>
    </div>
    <p>
      <Textfield
        v-model="emailAdress"
        :disabled="sending"
        :label="$t('login.emailLoginHelper')"
        dark
      />
    </p>
    <div class="toolbar">
      <div class="spacer" />
      <Button
        dark
        :disabled="!emailAdress"
        @click="sendLinkToEmail"
      >
        {{ $t('login.withEmail') }}
      </Button>
      <div class="spacer" />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useSnack } from '@/composables/useSnack'
import { useRouter } from 'vue-router'
import { useAuth } from '@/state/authz'
import { useI18n } from 'vue-i18n'
import { getAuth, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from '@firebase/auth'
import Button from '../form/Button.vue'
import Textfield from '../form/Textfield.vue'

export default defineComponent({
  components: {
    Button,
    Textfield
  },
  setup () {
    const emailAdress = ref('')
    const verify = isSignInWithEmailLink(getAuth(), window.location.href)
    const router = useRouter()
    const sending = ref(false)
    const { pushSnack } = useSnack()
    const i18n = useI18n()

    onMounted(() => {
      const { anonymousSession } = useAuth()
      if (!anonymousSession.value) router.push('/')
    })

    const singInWithEmail = () => {
      if (!emailAdress.value) {
        pushSnack({ topic: i18n.t('snacks.invalidEmail') })
      }
      signInWithEmailLink(getAuth(), emailAdress.value, window.location.href)
        .then(() => {
          // Clear email from storage.
          window.localStorage.removeItem('emailForSignIn')
          router.push('/profile')
        })
        .catch((error: Error) => {
          pushSnack({ topic: error.message })
          console.warn(error)
        })
    }

    if (verify) {
      emailAdress.value = window.localStorage.getItem('emailForSignIn') || ''
      if (emailAdress.value) {
        singInWithEmail()
      }
    }

    const actionCodeSettings = {
      // URL we want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: `https://${window.location.hostname}/login?verify=true`,
      // This must be true.
      handleCodeInApp: true
    }

    const sendLinkToEmail = async () => {
      if (verify) singInWithEmail()
      sending.value = true
      return sendSignInLinkToEmail(getAuth(), emailAdress.value, actionCodeSettings)
        .then(() => {
          // The link was successfully sent. Inform the user.
          // Save the email locally so you don't need to ask the user for it again
          // if they open the link on the same device.
          window.localStorage.setItem('emailForSignIn', emailAdress.value)
          pushSnack({ topic: i18n.t('snacks.emailSent') })
          router.push('/')
        })
        .catch((error: Error) => {
          pushSnack({ topic: error.message })
          sending.value = false
          console.warn(error)
        })
    }

    return { emailAdress, sendLinkToEmail, verify, sending }
  }
})
</script>

<style lang="sass" scoped>
.emailLoginForm
  box-sizing: border-box
  padding: 16px
  background: linear-gradient(-42deg, var(--chroma-secondary-a) 0%, var(--chroma-secondary-d) 100%)
  h3
    color: var(--chroma-secondary-i)
  p
    color: var(--chroma-secondary-h)
</style>
