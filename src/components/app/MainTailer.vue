<template>
  <div class="footnote">
    <img
      style="max-height: 56px; max-width:96px; padding-right: 12px;"
      src="@/assets/fox.svg"
      class="shadowLogo"
      alt="Pelilauta Logo"
    >
    <div>
      <p>Pelilauta 2 <span style="opacity:0.5">– {{ version }}</span></p>
      <p>
        <router-link to="/site/mekanismi/page/pelilauta-about">
          {{ $t('app.footnote') }}
        </router-link>
      </p>
      <p>Fork me @ <a href="https://github.com/villetakanen/pelilauta">GitHub</a></p>
    </div>
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
@import @/styles/include-media.scss

.footnote
  display: border-box
  position: absolute
  bottom: 0
  padding: 16px
  padding-bottom: 24px
  display: flex
  background: linear-gradient(11deg, var(--chroma-secondary-a) 0%, var(--chroma-secondary-b) 100%)
  p
    @include TypeBody2()
    color: var(--chroma-secondary-f)
    margin: 0
    padding: 0
    margin-bottom: 8px
  a
    text-decoration: none
    color: var(--chroma-secondary-h)

.shadowLogo
  filter: drop-shadow( 0px 0px 9px var(--chroma-secondary-f))

@include media('>=tablet')
  .footnote
    width: calc(100vw - 32px)
    margin-left: -310px
    padding-bottom: 32px
</style>
