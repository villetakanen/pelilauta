<template>
  <Column class="editPageForm">
    <template v-if="page && page.id">
      <div
        v-if="updated"
        class="warning"
      >
        {{ $t('site.page.updated') }}
      </div>
      <Textfield
        v-model="v.name.$model"
        :label="$t('site.page.title')"
        :error="v.name.$error"
      />
      <RichTextEditor
        v-model:content="v.content.$model"
        style="margin-top: 8px"
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
          :disabled="disableSaving"
          @click="save"
        >
          {{ $t('action.save') }}
        </Button>
      </div>
      <div class="debug">
        {{ page }}
      </div>
    </template>
    <Loader
      v-else
      poster
    />
  </Column>
</template>

<script lang="ts">
import { usePage, savePage } from '@/state/pages/usePage'
import { useSite } from '@/state/site'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { computed, defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Loader from '../app/Loader.vue'
import Button from '../form/Button.vue'
import Textfield from '../form/Textfield.vue'
import Column from '../layout/Column.vue'
import RichTextEditor from '../quill/RichTextEditor.vue'

export default defineComponent({
  name: 'TextStyles',
  components: { Column, Loader, Textfield, RichTextEditor, Button },
  setup () {
    const { page } = usePage()

    const updated = ref(false)
    const name = ref('')
    const content = ref('')

    const rules = computed(() => ({
      name: {
        required
      },
      content: {
        required
      }
    }))

    const v = useVuelidate(rules, { name, content })

    const disableSaving = computed(() => {
      if (updated.value) return true
      if (v.value.name.$error || v.value.content.$error) return true
      if (v.value.$anyDirty) return false
      return true
    })

    watch(page, (val) => {
      if (v.value.$anyDirty) {
        updated.value = true
      } else {
        name.value = val.name
        content.value = val.htmlContent
      }
    })

    const router = useRouter()
    const { site } = useSite()

    async function save () {
      page.value.name = name.value
      page.value.htmlContent = content.value

      await savePage(page.value)

      router.push(`/site/${site.value.id}/page/${page.value.id}`)
    }

    return { page, v, disableSaving, save, updated }
  }
})
</script>

<style lang="sass" scoped>
.warning
  background-color: var(--chroma-alert-field-tint)
  color: var(--chroma-alert)
</style>
