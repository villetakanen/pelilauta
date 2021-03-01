<template>
  <div class="welcomeCard">
    <h1>{{ $t(app.welcome.title ) }}</h1>
    <p>{{ $t(app.welcome.message ) }}</p>
    <Action
      v-if="isAnonymous"
      :to="login"
    >
      Login
    </Action>
  </div>
</template>

<script lang="ts">
import { useAuthState } from '@/state/authz'
import { defineComponent } from 'vue'
import Action from '../material/Action.vue'
/**
 * A simple welcome card for anonymous visitors
 */
export default defineComponent({
  name: 'WelcomeCard',
  components: { Action },
  setup () {
    const { isAnonymous } = useAuthState()
    return { isAnonymous }
  }
})
</script>
