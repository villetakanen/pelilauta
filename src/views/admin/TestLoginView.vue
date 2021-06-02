<template>
  <p>This view exists solely to enable e2e testing suite accounts to login.</p><p /><div>
    <input
      id="usernameField"
      v-model="username"
      type="textfield"
    >
    <input
      id="passwordField"
      v-model="password"
      type="textfield"
    >
    <button
      id="post"
      @click="login"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import firebase from 'firebase/app'
import 'firebase/auth'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'TestLoginView',
  setup () {
    const password = ref('')
    const username = ref('')
    const router = useRouter()
    const login = () => {
      firebase.auth().signInWithEmailAndPassword(username.value, password.value).then(() => {
        router.push('/profile')
      }).catch((error) => {
        console.error(error)
        router.push('/login')
      })
    }
    return { username, password, login }
  }
})
</script>
