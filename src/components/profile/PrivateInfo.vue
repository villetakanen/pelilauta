<template>
  <transition name="fade">
    <MaterialCard
      v-if="sSOData"
    >
      <h2>{{ $t('profile.ssoInfocardTitle') }}</h2>
      <p>{{ $t('profile.ssoInfocardHelper') }}</p>
      <p>{{ sSOData }}</p>
    </MaterialCard>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'

export default defineComponent({
  name: 'PrivateProfileInfoCard',
  components: {
    MaterialCard
  },
  setup () {
    const sSOData = null
    return { sSOData }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

</style>
