<template>
  <div class="viewFull">
    <h3>{{ $t('wiki.createSiteTitle') }}</h3>
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
import { useAuthState } from '@/state/authz'
import { useRouter } from 'vue-router'

export default defineComponent({
  components: { MaterialCard, TextField, MaterialButton },
  setup () {
    const { allSites, createSite } = useSites()
    const { uid } = useAuthState()
    const router = useRouter()
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
      return createSite(uri.value, uid.value, siteName.value).then(() => {
        return router.push('/site/meta/' + uri.value)
      })
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
