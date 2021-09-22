<template>
  <div class="footnote">
    <img
      style="max-height: 56px; max-width:96px; float: left; padding-right: 12px; padding-bottom: 64px"
      src="@/assets/fox.svg"
      class="shadowLogo"
      alt="Pelilauta Logo"
    >
    <p>Pelilauta 2 <span style="opacity:0.5">– {{ version }}</span></p>
    <p>
      <router-link to="/site/mekanismi/page/pelilauta-about">
        {{ $t('app.footnote') }}
      </router-link>
    </p>
    <p>Fork me @ <a href="https://github.com/villetakanen/pelilauta">GitHub</a></p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { version } from '../../../package.json'

export default defineComponent({
  name: 'MainTailer',
  setup () {
    return { version }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass

.footnote
  padding:16px
  padding-bottom: 64px
  p
    @include TypeBody2()
    color: var(--color-a-d)
    margin-bottom: 8px
  a
    text-decoration: none
    color: var(--color-a-a)

.shadowLogo
  filter: drop-shadow( 0px 0px 12px var(--color-b-a))
</style>
