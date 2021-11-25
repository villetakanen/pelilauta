<template>
  <div
    class="LocaleSwitcher"
    @click="clicked"
  >
    <div
      class="en"
      :class="{ nonselected: locale !== 'en' }"
    >
      <img
        src="@/assets/flags/gb.svg"
        alt="en"
      >
    </div>
    <div
      class="fi"
      :class="{ nonselected: locale !== 'fi' }"
    >
      <img
        src="@/assets/flags/fi.svg"
        alt="fi"
      >
    </div>
  </div>
</template>

<script lang="ts">
import { useAuth } from '@/state/authz'
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  setup () {
    const i18n = useI18n()
    const { setLocale, anonymousSession } = useAuth()

    const locale = computed({
      get: () => i18n.locale.value,
      set: (value) => {
        i18n.locale.value = value
        if (!anonymousSession.value) {
          setLocale(value)
        }
      }
    })

    function clicked () {
      const nextLocale = locale.value === 'en' ? 'fi' : 'en'
      locale.value = nextLocale
    }

    return {
      locale,
      clicked
    }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass
div.LocaleSwitcher
  display: inline-block
  box-sizing: border-box
  padding: 0
  height: 36px
  div.en, div.fi
    height: 36px
    display: inline-block
    text-transform: uppercase
    transition: all 0.3s ease-in-out
    border-radius: 18px
    img
      height: 36px
      width: 36px
  div.en
    margin-right: 4px
  div.nonselected
    img
      -webkit-filter: grayscale(100%)
      filter: grayscale(100%)
      opacity: 0.55
    background-color: var(--chroma-secondary-f)
</style>
