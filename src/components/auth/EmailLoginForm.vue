<template>
  <MaterialCard>
    <p v-if="verify">
      Please verify your email address.
    </p>
    <p v-else>
      {{ $t('login.emailLoginMessage') }}
      <router-link to="/mekanismi/view/mekanismi/meta-privacy-info">
        {{ $t('login.emailLoginDataInfoLink') }}
      </router-link>
    </p>
    <TextField
      v-model="emailAdress"
      :disabled="sending"
    />
    <Toolbar>
      <div class="spacer" />
      <MaterialButton :async-action="sendLinkToEmail">
        {{ $t('login.withEmail') }}
      </MaterialButton>
    </Toolbar>
  </MaterialCard>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import MaterialButton from '../material/MaterialButton.vue'
import MaterialCard from '../material/MaterialCard.vue'
import TextField from '../material/TextField.vue'
import firebase from 'firebase/app'
import { useSnack } from '@/composables/useSnack'
import { useRouter } from 'vue-router'
import Toolbar from '../layout/Toolbar.vue'
import { useAuthState, useProfile } from '@/state/authz'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  components: { MaterialCard, TextField, MaterialButton, Toolbar },
  setup () {
    const emailAdress = ref('')
    const verify = firebase.auth().isSignInWithEmailLink(window.location.href)
    const router = useRouter()
    const sending = ref(false)
    const { pushSnack } = useSnack()
    const i18n = useI18n()

    onMounted(() => {
      const { isAnonymous } = useAuthState()
      if (!isAnonymous.value) router.push('/profile')
    })

    const singInWithEmail = () => {
      if (!emailAdress.value) {
        console.log('missing email adress value')
        pushSnack({ topic: i18n.t('snacks.invalidEmail') })
      }
      firebase.auth().signInWithEmailLink(emailAdress.value, window.location.href)
        .then((result) => {
          // Clear email from storage.
          window.localStorage.removeItem('emailForSignIn')
          // You can access the new user via result.user
          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null
          // You can check if the user is new or existing:
          // result.additionalUserInfo.isNewUser
          const { createProfile, profile } = useProfile()
          if (!profile.value.uid) {
            createProfile().then(() => {
              console.log(result)
              router.push('/profile')
            }).catch((error: Error) => {
              pushSnack({ topic: error.message })
              console.log(error)
              firebase.auth().signOut()
            })
          }
        })
        .catch((error: Error) => {
          pushSnack({ topic: error.message })
          console.log(error)
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
      return firebase.auth().sendSignInLinkToEmail(emailAdress.value, actionCodeSettings)
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
          console.log(error)
        })
    }

    return { emailAdress, sendLinkToEmail, verify, sending }
  }
})
</script>
