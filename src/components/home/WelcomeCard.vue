<template>
  <Card class="welcomeCard">
    <img
      class="logo"
      alt="Pelilauta"
      src="@/assets/fox.svg"
      :rise="2"
    >
    <h1>{{ $t('app.welcome.title') }}</h1>
    <p>{{ $t('app.welcome.message') }}</p>
    <div
      class="toolbar"
      style="margin-bottom: -8px"
    >
      <div class="spacer" />
      <Action
        to="/login"
        dark
        mobile
      >
        {{ $t('action.login') }}
      </Action>
    </div>
  </Card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Card from '../layout/Card.vue'
import Action from '../material/Action.vue'
/**
 * A simple welcome card for anonymous visitors
 */
export default defineComponent({
  name: 'WelcomeCard',
  components: { Action, Card }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.welcomeCard
  display: block
  // background: linear-gradient(-42deg, var(--chroma-secondary-f) 0%, var(--chroma-secondary-b) 100%)
  background: linear-gradient(-42deg, var(--chroma-primary-a) 0%, var(--chroma-primary-d) 100%)
  position: relative
  img.logo
    position: absolute
    top: 16px
    left: 8px
    height: 72px
    width: 72px
  h1
    @include TypeCardHeadline()
    color: var(--chroma-clear)
    margin-left: 72px
  p
    @include TypeBody2()
    margin-left: 72px
    color: var(--chroma-clear)
    opacity: 0.72

</style>
