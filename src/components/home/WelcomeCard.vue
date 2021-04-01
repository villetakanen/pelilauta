<template>
  <div class="welcomeCard">
    <img
      class="logo"
      :alt="$t('site.title')"
      src="@/assets/fox.svg"
    >
    <h1>{{ $t('app.welcome.title') }}</h1>
    <p>{{ $t('app.welcome.message') }}</p>
    <div
      class="toolbar"
      style="margin-bottom: -8px"
    >
      <div class="spacer" />
      <Action
        v-if="isAnonymous"
        to="/login"
        dark
        mobile
      >
        {{ $t('action.login') }}
      </Action>
    </div>
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

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.welcomeCard
  display: block
  background: linear-gradient(-42deg, var(--chroma-secondary-f) 0%, var(--chroma-secondary-b) 100%)
  margin-bottom: 8px
  padding: 16px
  border-radius: 8px
  position: relative
  img.logo
    position: absolute
    top: 16px
    left: 8px
    height: 72px
    width: 72px
  h1
    @include TypeCardHeadline()
    color: var(--chroma-secondary-i)
    margin-left: 72px
  p
    @include TypeBody2()
    margin-left: 72px
    color: var(--chroma-secondary-h)

</style>
