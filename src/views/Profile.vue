<template>
  <h1 class="viewHeader">
    {{ profile.nick }}
  </h1>
  <MaterialCard>
    <img
      v-if="profile.photoURL"
      class="avatar"
      :src="profile.photoURL"
      :alt="profile.nick"
    >
    <div>
      {{ $t('language.label') }} <a @click="setLang('en')">EN</a> / <a @click="setLang('fi')">FI</a>
    </div>
    <div style="clear:both" />
  </MaterialCard>
  <LovedThreads />
  <ProfileActions />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import LovedThreads from '@/components/profile/LovedThreads.vue'
import ProfileActions from '@/components/profile/ProfileActions.vue'
import { useAuthz } from '@/lib/authz'

export default defineComponent({
  name: 'Home',
  components: {
    MaterialCard,
    LovedThreads,
    ProfileActions
  },
  setup () {
    const { profile, switchLang } = useAuthz()

    function setLang (lang: string) {
      switchLang(lang)
    }

    return { profile, setLang }
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
