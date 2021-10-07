<template>
  <Column class="createASiteAd">
    <div style="position: relative; margin: -16px">
      <img
        alt=""
        class="splash"
        src="https://firebasestorage.googleapis.com/v0/b/skaldbase.appspot.com/o/mekanismi%2FSnowy%20Green%20Mountain.105.v2%20POST.jpg?alt=media&token=fe488c4c-c4f2-44ac-816d-21397636d51f"
      >
      <h1>
        <router-link to="/mekanismi">
          {{ $t('calltoaction.site.title') }}
        </router-link>
      </h1>
    </div>
    <p
      class="TypeBody2 mediumEmphasis"
      style="margin-top: 24px"
    >
      {{ $t('calltoaction.site.text') }}
    </p>
    <p class="TypeBody2 mediumEmphasis">
      {{ $t('calltoaction.site.text2') }}
    </p>
    <div
      v-if="showMemberTools"
      style="text-align: center"
    >
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
    <div
      v-if="!showMemberTools"
      style="text-align: center"
    >
      <Icon
        name="mekanismi"
        dark
        headline
      />
    </div>
  </Column>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Column from '@/components/layout/Column.vue'
import Button from '@/components/form/Button.vue'
import { useUxActions } from '@/composables/useUxActions'
import { useAuth } from '@/state/authz'
import Icon from '@/components/material/Icon.vue'

export default defineComponent({
  name: 'CreateASiteAd',
  components: { Column, Button, Icon },
  setup () {
    const { reroute } = useUxActions()
    const { showMemberTools } = useAuth()
    return { reroute, showMemberTools }
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
    text-shadow: 0px 0px 16px var(--chroma-secondary-a)
    background: linear-gradient(180deg, rgba(0, 32, 30, 0) 0%, var(--chroma-secondary-a) 100%)
    z-index: 10
    bottom: 6px
    left: 0
    padding: 8px 16px
    padding-top: 24px
    box-sizing: border-box
    line-height: 32px
    width: 100%
    a
      color: white
  p
    color: var(--chroma-secondary-i)
  img.splash
    width: 100%
    opacity: 1
</style>
