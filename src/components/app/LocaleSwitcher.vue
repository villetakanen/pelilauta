<template>
  <div
    class="LocaleSwitcher"
    @click="clicked"
  >
    <div
      class="en"
      :class="{ selected: locale === 'en' }"
    >
      en
    </div>
    <div
      class="fi"
      :class="{ selected: locale === 'fi' }"
    >
      fi
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
  border: solid 1px var(--chroma-secondary-g)
  border-radius: 18px
  height: 36px
  padding: 0
  box-sizing: border-box
  div.en, div.fi
    height: 32px
    display: inline-block
    text-transform: uppercase
    line-height: 36px
    padding: 0 8px
    margin: 1px
    transition: all 0.3s ease-in-out
  div.selected
    background-color: var(--chroma-secondary-h)
    border-radius: 18px
</style>
