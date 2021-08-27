<template>
  <div id="sideNavAction-home">
    <h4 class="hideOnMobile siteIdentity">
      <router-link to="/">
        <img
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
    <Action
      mobile
      class="onlyForMobile"
      :to="mekanismi ? '/mekanismi' : '/'"
    >
      <span v-if="!mekanismi">Pelilauta</span>
      <span v-else>Mekanismi</span>
    </Action>
  </div>
</template>

<script lang="ts">
import { ComputedRef, defineComponent, inject } from 'vue'
import Action from '../material/Action.vue'

export default defineComponent({
  components: { Action },
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
    margin-left: 48px
</style>
