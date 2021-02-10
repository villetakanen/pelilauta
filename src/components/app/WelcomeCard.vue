<template>
  <transition name="fade">
    <MaterialCard
      v-if="isAnonymous"
      class="welcome"
    >
      <img
        class="logo"
        src="@/assets/fox.svg"
        alt=""
      >
      <h1>{{ $t('welcome.header') }}</h1>
      <p>{{ $t('welcome.paragraph') }}</p>
      <Toolbar>
        <div class="spacer" />
        <MaterialButton to="/login">
          {{ $t('action.login') }}
        </MaterialButton>
      </Toolbar>
    </MaterialCard>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import { useAuthState } from '@/state/authz'
import Toolbar from '../layout/Toolbar.vue'

export default defineComponent({
  name: 'WelcomeCard',
  components: {
    MaterialCard,
    MaterialButton,
    Toolbar
  },
  setup () {
    const { isAnonymous } = useAuthState()
    return { isAnonymous }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.welcome
  position: relative
  text-align: right
  background-image: url('../../assets/backgrounds/please-login-card.svg')
  background-position: top left
  background-size: cover
  height: 120px
  padding-bottom: 16px
  h1, p
    text-align: left
    margin-left: 80px
    color: white
    opacity: 0.8

@include media('<950px')
  .welcome
    height: 176px

.logo
  height: 64px
  width: 64px
  position: absolute
  top: 16px
  left: 16px
</style>
