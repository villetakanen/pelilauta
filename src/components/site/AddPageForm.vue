<template>
  <div class="addPageForm">
    <h3>{{ $t('site.actions.addPage') }}</h3>
    <TextField
      id="addPageCardPageNameField"
      v-model="v.pageName.$model"
      :label="$t('site.page.title')"
      :error="v.pageName.$error"
    />
    <p>{{ $t('site.page.adress') }}: <span class="mockURL">{{ address }}</span></p>
    <div class="toolbar">
      <div class="spacer" />
      <MaterialButton
        text
        :action="cancel"
      >
        {{ $t('action.cancel') }}
      </MaterialButton>
      <MaterialButton
        id="addPageCardCreateButton"
        :disabled="v.pageName.$error || !v.pageName.$dirty"
        :async-action="add"
      >
        {{ $t('action.add') }}
      </MaterialButton>
    </div>
  </div>
</template>

<script lang="ts">
import { addPage, usePages, useSite } from '@/state/site'
import { computed, defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import MaterialButton from '../material/MaterialButton.vue'
import TextField from '../material/TextField.vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { toMekanismiURI } from '@/utils/contentFormat'
import { useSnack } from '@/composables/useSnack'
import { useI18n } from 'vue-i18n'
import { useAuthState } from '@/state/authz'

export default defineComponent({
  name: 'AddPageForm',
  components: {
    TextField,
    MaterialButton
  },
  setup () {
    const { site } = useSite()
    const { pages } = usePages()
    const router = useRouter()
    const pageName = ref('')
    const i18n = useI18n()

    const address = computed(() => {
      return `${window.location.hostname}/mekanismi/view/${site.value.id}/`
    })

    function cancel () {
      router.back()
    }

    // Validators
    //
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const notUsed = (value?:any) => {
      if (!value) return true
      return typeof pages.value.find((a) => (a.id === toMekanismiURI(pageName.value))) === 'undefined'
    }
    const rules = {
      pageName: { required, notUsed }
    }
    const v = useVuelidate(rules, { pageName })
    const { pushSnack } = useSnack()

    // Save the page
    const { uid } = useAuthState()
    async function add () {
      if (v.value.$errors.length > 0) {
        pushSnack(i18n.t('sites.pages.canNoAddError'))
        return
      }
      await addPage(uid.value, site.value.id, pageName.value)
      router.push(`/mekanismi/view/${site.value.id}/${toMekanismiURI(pageName.value)}`)
    }

    return { address, cancel, v, add }
  }
})
</script>

<style lang="sass" scoped>
.mockURL
  color: var(--chroma-primary-d)
</style>
