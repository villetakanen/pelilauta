<template>
  <transition name="fade">
    <MaterialCard
      v-if="sSOData"
    >
      <h2>{{ $t('profile.publicInfoTitle') }}</h2>
      <p>{{ $t('profile.publicInfoHelper') }}</p>
      <p>{{ sSOData }}</p>
    </MaterialCard>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import { useProfile } from '@/state/authz'

export default defineComponent({
  name: 'PublicProfileInfoCard',
  components: {
    MaterialCard
  },
  setup () {
    const { sSOData } = useProfile()
    return { sSOData }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

</style>
