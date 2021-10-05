<template>
  <div class="createSite">
    <Toolbar>
      <h3>{{ $t('action.addSite') }}</h3>
    </Toolbar>
    <div class="singleColumnLayout">
      <MaterialCard>
        <TextField
          v-model="v.siteName.$model"
          :label="$t('wiki.newSiteFieldLabel')"
          :class="{ error: v.siteName.$error }"
        />
        <div class="fieldCaption">
          <div>slug: /{{ uri }}</div>
          <div class="spacer" />
          <div
            v-if="v.siteName.$error"
            class="fieldErrorLabel"
          >
            {{ $t('wiki.errorSiteSlug') }}
          </div>
        </div>
        <div class="toolbar">
          <div class="spacer" />
          <MaterialButton
            text
            to="/mekanismi"
          >
            {{ $t('action.cancel') }}
          </MaterialButton>
          <MaterialButton
            :disabled="v.siteName.$error || !v.siteName.$dirty"
            :async-action="createSiteAction"
          >
            {{ $t('action.add') }}
          </MaterialButton>
        </div>
      </MaterialCard>
    </div>
  </div>
</template>

<script lang="ts">
import MaterialButton from '@/components/material/MaterialButton.vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import TextField from '@/components/material/TextField.vue'
import { computed, defineComponent, ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useSites } from '@/state/sites'
import { toMekanismiURI } from '@/utils/contentFormat'
export default defineComponent({
  components: { MaterialCard, TextField, MaterialButton },
  setup () {
    const { allSites } = useSites()
    const siteName = ref('')
    const uri = computed(() => (toMekanismiURI(siteName.value)))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const notUsed = (value?:any) => {
      if (!value) return true
      return typeof allSites.value.find((a) => (a.id === toMekanismiURI(siteName.value))) === 'undefined'
    }

    const rules = {
      siteName: { notUsed, required }
    }
    const v = useVuelidate(rules, { siteName })

    async function createSiteAction () {
    }

    return { siteName, v, uri, createSiteAction }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.viewFull
  padding: 0 16px
.fieldCaption
  display: flex
  @include TypeCaption()
  padding-bottom: 16px
  .spacer
    flex-grow: 1
  .fieldErrorLabel
    color: $color-fill-secondary
</style>
