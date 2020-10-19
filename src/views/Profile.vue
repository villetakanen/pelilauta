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
        {{ $t('action.logout') }}
      </MaterialButton>
    </div>
    <div>
      {{ $t('language.label') }} <a @click="setLang('en')">EN</a> / <a @click="setLang('fi')">FI</a>
    </div>
    <div style="clear:both" />
  </MaterialCard>
  <LovedThreads />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import { useRouter } from 'vue-router'
import MaterialButton from '@/components/material/MaterialButton.vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import LovedThreads from '@/components/profile/LovedThreads.vue'
import { useAuthz } from '@/lib/authz'

export default defineComponent({
  name: 'Home',
  components: {
    MaterialButton,
    MaterialCard,
    LovedThreads
  },
  setup () {
    const { profile, switchLang } = useAuthz()
    const router = useRouter()

    const logout = () => {
      firebase.auth().signOut().then(() => {
        router.push('/')
      })
    }

    function setLang (lang: string) {
      switchLang(lang)
    }

    return { profile, logout, setLang }
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
