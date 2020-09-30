<template>
  <MaterialCard>
    <img class="avatar" v-if="profile.photoURL" :src="profile.photoURL" :alt="profile.nick"/>
    <h1>{{profile.nick}}</h1>
    <MaterialButton :action="logout">Logout</MaterialButton>
    <div style="clear:both" />
  </MaterialCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import { useRouter } from 'vue-router'
import MaterialButton from '@/components/material/MaterialButton.vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import { useAuthz } from '@/lib/authz'

export default defineComponent({
  name: 'Home',
  components: {
    MaterialButton,
    MaterialCard
  },
  setup () {
    const { profile } = useAuthz()
    const router = useRouter()

    const logout = () => {
      firebase.auth().signOut().then(() => {
        router.push('/')
      })
    }

    return { profile, logout }
  }
})
</script>

<style lang="sass" scoped>
img.avatar
  float: left
  max-width: 180px
  max-height: 180px
  border-radius: 50%

</style>
