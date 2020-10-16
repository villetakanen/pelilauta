<template>
  <MaterialCard>
    <img
      v-if="profile.photoURL"
      class="avatar"
      :src="profile.photoURL"
      :alt="profile.nick"
    >
    <div class="toolbar">
      <h1>{{ profile.nick }}</h1>
      <MaterialButton :action="logout">
        Logout
      </MaterialButton>
    </div>
    <div>
      {{ $t('language.label') }} <a @click="locale = 'en'">EN</a> / <a @click="locale = 'fi'">FI</a>
    </div>
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
import { useI18n } from 'vue-i18n'

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

    return { profile, logout, ...useI18n() }
  }
})
</script>

<style lang="sass" scoped>
img.avatar
  float: left
  max-width: 122px
  max-height: 122px
  border-radius: 50%
  margin-right: 8px

</style>
