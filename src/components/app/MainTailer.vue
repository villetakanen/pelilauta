<template>
  <div class="footnote">
    <span style="line-height: 56px;opacity:0.37; font-size:12px">Pelilauta</span>
    <img
      style="max-height: 56px; max-width:96px; vertical-align: middle"
      src="@/assets/fox.svg"
      class="shadowLogo"
      alt="Pelilauta Logo"
    >
    <span style="line-height: 56px;opacity:0.37; font-size:12px">{{ version }} </span>
    <div style="text-align: center; padding:16px; line-height: 12px;opacity:0.37; font-size:12px">
      <router-link to="/about">
        {{ $t('app.footnote') }}
      </router-link>
    </div>
    <div style="text-align: center; padding:16px; line-height: 12px;opacity:0.37; font-size:12px">
      <a href="https://github.com/villetakanen/pelilauta">GitHub</a>
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
.footnote
  text-align: center
  padding:16px
  a
    text-decoration: none

.shadowLogo
  filter: drop-shadow( 0px 0px 12px var(--chroma-primary-c))
</style>
