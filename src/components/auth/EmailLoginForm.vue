<template>
  <Column class="emailLoginForm">
    <div
      v-if="verify"
      class="verifyWarning"
    >
      {{ $t('login.verifyEmailLoginMessage') }}
    </div>
    <div v-else>
      <h1 class="title">
        {{ $t('login.emailLoginMessage') }}
      </h1>
    </div>
    <div class="toolbar">
      <TextField
        v-model="emailAdress"
        :disabled="sending"
        :label="$t('login.emailLoginHelper')"
      />
      <MaterialButton :async-action="sendLinkToEmail">
        {{ $t('login.withEmail') }}
      </MaterialButton>
    </div>
  </Column>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import MaterialButton from '../material/MaterialButton.vue'
import TextField from '../material/TextField.vue'
import { useSnack } from '@/composables/useSnack'
import { useRouter } from 'vue-router'
import { useAuth } from '@/state/authz'
import { useI18n } from 'vue-i18n'
import { getAuth, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from '@firebase/auth'
import Column from '../layout/Column.vue'

export default defineComponent({
  components: {
    TextField,
    MaterialButton,
    Column
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
      if (!anonymousSession.value) router.push('/profile')
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
  background-color: var(--color-b-a)
  h1.title
    color: white
    opacity: 0.72
    margin-bottom: 16px
</style>
