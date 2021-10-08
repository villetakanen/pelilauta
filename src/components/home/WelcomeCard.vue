<template>
  <Column class="welcomeCard">
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
      <div class="spacer" />
    </div>
  </Column>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Column from '../layout/Column.vue'
import Action from '../material/Action.vue'
/**
 * A simple welcome card for anonymous visitors
 */
export default defineComponent({
  name: 'WelcomeCard',
  components: { Action, Column }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass
@import @/styles/include-media.scss

.welcomeCard
  margin: 16px
  margin-top: 8px
  margin-bottom: 24px
  background: linear-gradient(-42deg, var(--chroma-secondary-a) 0%, var(--chroma-secondary-d) 100%)
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

@include media('>=tablet')
  .welcomeCard
    margin: 0
    margin-bottom: 24px
    margin-top: 8px

</style>
