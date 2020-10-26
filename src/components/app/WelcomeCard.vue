<template>
  <MaterialCard class="welcome">
    <img class="logo" src="@/assets/fox-on-blue.png">
    <h1>{{ $t('welcome.header') }}</h1>
    <p>{{ $t('welcome.paragraph') }}</p>
    <MaterialButton to="/login">
      {{ $t('action.login') }}
    </MaterialButton>
  </MaterialCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import MaterialButton from '@/components/material/MaterialButton.vue'

export default defineComponent({
  name: 'WelcomeCard',
  components: {
    MaterialCard,
    MaterialButton
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.welcome
  text-align: center
  h1, p
    text-align: center

.logo
  max-height: 120px
  margin: 0 auto
  display: block
  opacity: 0.75
</style>
