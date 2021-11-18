<template>
  <section class="createASiteAd">
    <div style="position: relative; margin: -16px">
      <img
        alt=""
        class="splash"
        src="/src/wootha-public-domain-talk-to-me.jpg"
      >
      <h1>
        <router-link to="/mekanismi">
          {{ $t('calltoaction.site.title') }}
        </router-link>
      </h1>
    </div>
    <p
      class="TypeBody2 mediumEmphasis"
      style="margin-top: 32px"
    >
      {{ $t('calltoaction.site.text') }}
    </p>
    <p class="TypeBody2 mediumEmphasis">
      {{ $t('calltoaction.site.text2') }}
    </p>
    <div
      v-if="showMemberTools"
      style="text-align: center; margin-top:20px"
    >
      <Button
        text
        dark
        @click="reroute('/mekanismi/sites/profile')"
      >
        {{ $t('sites.home.title') }}
      </Button>
      <Button
        tertiary
        @click="reroute('/create/site')"
      >
        {{ $t('action.addSite') }}
      </Button>
    </div>
    <div
      v-if="!showMemberTools"
      style="text-align: center"
    >
      <Icon
        name="mekanismi"
        dark
        medium
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Button from '@/components/form/Button.vue'
import { useUxActions } from '@/composables/useUxActions'
import { useAuth } from '@/state/authz'
import Icon from '@/components/material/Icon.vue'

export default defineComponent({
  name: 'CreateASiteAd',
  components: { Button, Icon },
  setup () {
    const { reroute } = useUxActions()
    const { showMemberTools } = useAuth()
    return { reroute, showMemberTools }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass
@import @/styles/include-media.scss

.createASiteAd
  background: linear-gradient(-18deg, var(--chroma-secondary-d) 0%, var(--chroma-primary-d) 100%)
  position: relative
  padding: 24px
  margin: -8px
  h1
    @include TypeHeadline5()
    display: block
    color: white
    position: absolute
    text-shadow: 0px 0px 16px var(--chroma-secondary-a)
    background: linear-gradient(180deg, rgba(0, 32, 30, 0) 0%, var(--chroma-secondary-a) 100%)
    z-index: 10
    bottom: 6px
    left: 0
    padding: 8px 24px
    padding-top: 24px
    box-sizing: border-box
    line-height: 32px
    width: calc(100% + 16px)
    margin: -8px
    a
      color: white
  p
    color: var(--chroma-secondary-i)
  img.splash
    width: calc(100% + 16px)
    opacity: 1
    margin: -8px
section + .createASiteAd
    margin-top: 12px

@include media('>=tablet')
  .createASiteAd
    margin: 0
</style>
