<template>
  <Column class="createASiteAd">
    <div style="position: relative; margin: -16px">
      <img
        class="splash"
        src="https://firebasestorage.googleapis.com/v0/b/skaldbase.appspot.com/o/mekanismi%2FSnowy%20Green%20Mountain.105.v2%20POST.jpg?alt=media&token=fe488c4c-c4f2-44ac-816d-21397636d51f"
      >
      <h1>{{ $t('calltoaction.site.title') }}</h1>
    </div>
    <p style="margin-top: 24px">
      {{ $t('calltoaction.site.text') }}
    </p>
    <p>{{ $t('calltoaction.site.text2') }}</p>
    <div style="text-align: center">
      <Button
        text
        dark
        @click="reroute('/mekanismi/sites/profile')"
      >
        {{ $t('sideNav.toMySitesLink') }}
      </Button>
      <Button
        tertiary
        @click="reroute('/create/site')"
      >
        {{ $t('action.addSite') }}
      </Button>
    </div>
  </Column>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Column from '@/components/layout/Column.vue'
import Button from '@/components/form/Button.vue'
import { useUxActions } from '@/composables/useUxActions'

export default defineComponent({
  name: 'CreateASiteAd',
  components: { Column, Button },
  setup () {
    const { reroute } = useUxActions()
    return { reroute }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass

.createASiteAd
  margin: 8px
  background: linear-gradient(-18deg, var(--chroma-secondary-d) 0%, var(--chroma-primary-d) 100%)
  position: relative
  h1
    @include TypeHeadline5()
    display: block
    color: white
    position: absolute
    // text-shadow: 0px 0px 16px var(--chroma-secondary-a)
    background: linear-gradient(180deg, rgba(0, 32, 30, 0) 0%, var(--chroma-secondary-a) 100%)
    z-index: 10
    bottom: 6px
    left: 0
    padding: 4px 16px
    padding-top: 12px
    box-sizing: border-box
    line-height: 32px
    width: 100%
  p
    color: var(--chroma-secondary-i)
  img.splash
    width: 100%
    opacity: 1
</style>
