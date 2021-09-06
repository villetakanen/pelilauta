<template>
  <div id="sideNavAction-home">
    <h4 class="siteIdentity">
      <router-link to="/">
        <img
          class="hideOnMobile"
          alt=""
          src="@/assets/fox-green.svg"
        >
        {{ $t('app.title') }}
      </router-link>
      <span
        v-if="mekanismi"
        class="subtitle"
      > / <router-link to="/mekanismi">Mekanismi</router-link></span>
    </h4>
  </div>
</template>

<script lang="ts">
import { ComputedRef, defineComponent, inject } from 'vue'

export default defineComponent({
  setup () {
    const mekanismi = inject('appMode') as ComputedRef<boolean>
    return { mekanismi }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss

.siteIdentity
  margin-left: 0px
  h4
    line-height: 40px
  .subtitle, .subtitle a
    color: var(--chroma-primary-b)
  img
    height: 40px
    width: 40px
    vertical-align: middle
    margin-top: -4px
    margin-bottom: -4px

@include media('<tablet')
  #sideNavAction-home
    margin-left: 8px
</style>
