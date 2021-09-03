<template>
  <MaterialCard>
    <p>
      New user registration not active yet. Please use <a href="http://mekanismi.web.app">mekanismi.web.app</a>
      to register before using the site.
    </p>
    <MaterialButton :action="logout">
      Logout
    </MaterialButton>
  </MaterialCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import { useRouter } from 'vue-router'
import { getAuth } from '@firebase/auth'

export default defineComponent({
  name: 'Home',
  components: {
    MaterialCard,
    MaterialButton
  },
  setup () {
    const router = useRouter()

    const logout = () => {
      getAuth().signOut().then(() => {
        router.push('/')
      })
    }

    return { logout }
  }
})
</script>
