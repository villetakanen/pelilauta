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
      <Button
        text
        @click="cancel"
      >
        {{ $t('action.cancel') }}
      </Button>
      <Button
        id="addPageCardCreateButton"
        :disabled="v.pageName.$error || !v.pageName.$dirty"
        @click="add"
      >
        {{ $t('action.add') }}
      </Button>
    </div>
    <div
      v-if="showAdminTools"
      class="debug"
    >
      <p class="TypeCaption">
        Site
      </p>
      {{ site }}
      <p class="TypeCaption">
        Page
      </p>
      {{ page }}
    </div>
  </div>
</template>

<script lang="ts">
import { usePages, useSite } from '@/state/site'
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import Textfield from '@/components/form/Textfield.vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { toMekanismiURI } from '@/utils/contentFormat'
import { useSnack } from '@/composables/useSnack'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/state/authz'
import Button from '@/components/form/Button.vue'
import { Page, createPage } from '@/state/pages/usePage'

export default defineComponent({
  name: 'AddPageForm',
  components: {
    Textfield,
    Button
  },
  setup () {
    const { showAdminTools } = useAuth()
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

    async function add () {
      const page = new Page()

      page.name = pageName.value
      const slug = await createPage(page)

      router.push(`/mekanismi/view/${site.value.id}/${slug}`)
    }

    return { cancel, v, add, showAdminTools, site }
  }
})
</script>

<style lang="sass" scoped>
.mockURL
  color: var(--chroma-primary-d)
</style>
