<template>
  <div class="addPageForm">
    <Textfield
      id="addPageCardPageNameField"
      v-model="v.pageName.$model"
      :label="$t('site.page.title')"
      :error="v.pageName.$error"
    />
    <div class="toolbar">
      <div class="spacer" />
      <MaterialButton
        text
        :action="cancel"
      >
        {{ $t('action.cancel') }}
      </MaterialButton>
      <Button
        id="addPageCardCreateButton"
        :disabled="v.pageName.$error || !v.pageName.$dirty"
        @click="add"
      >
        {{ $t('action.add') }}
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import { addPage, usePages, useSite } from '@/state/site'
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import MaterialButton from '../material/MaterialButton.vue'
import Textfield from '@/components/form/Textfield.vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { toMekanismiURI } from '@/utils/contentFormat'
import { useSnack } from '@/composables/useSnack'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/state/authz'
import Button from '@/components/form/Button.vue'

export default defineComponent({
  name: 'AddPageForm',
  components: {
    Textfield,
    MaterialButton,
    Button
  },
  setup () {
    const { site } = useSite()
    const { pages } = usePages()
    const router = useRouter()
    const pageName = ref('')
    const i18n = useI18n()

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
    const { user } = useAuth()
    async function add () {
      if (v.value.$errors.length > 0) {
        pushSnack(i18n.t('sites.pages.canNoAddError'))
        return
      }
      await addPage(user.value.uid, site.value.id, pageName.value)
      router.push(`/mekanismi/view/${site.value.id}/${toMekanismiURI(pageName.value)}`)
    }

    return { cancel, v, add }
  }
})
</script>

<style lang="sass" scoped>
.mockURL
  color: var(--chroma-primary-d)
</style>
