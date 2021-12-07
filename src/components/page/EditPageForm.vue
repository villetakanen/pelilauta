<template>
  <Column class="editPageForm">
    <template v-if="page && page.id">
      <transition name="appear">
        <div
          v-if="updated && !working"
          class="warning"
        >
          {{ $t('site.page.updated') }}
        </div>
      </transition>
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
        <Select
          v-model="v.category.$model"
          name="CategorySelect"
          :opts="opts"
          :label="$t('wiki.page.category')"
          class="pageCategory"
        />
        <div class="spacer" />
        <Button
          text
          @click="back"
        >
          {{ $t('action.cancel') }}
        </Button>
        <Button
          id="addPageCardCreateButton"
          :working="working"
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
import Select from '../form/Select.vue'
import Textfield from '../form/Textfield.vue'
import Column from '../layout/Column.vue'
import RichTextEditor from '../quill/RichTextEditor.vue'
import { useUxActions } from '@/composables/useUxActions'

export default defineComponent({
  name: 'TextStyles',
  components: { Column, Loader, Textfield, RichTextEditor, Button, Select },
  setup () {
    const { site } = useSite()
    const { page } = usePage()
    const { back } = useUxActions()

    const updated = ref(false)
    const name = ref('')
    const content = ref('')
    const working = ref(false)

    const opts = computed(() => (new Map(site.value.pageCategories.map((c) => ([c.slug, c.name])))))
    const category = ref('')

    const rules = computed(() => ({
      name: {
        required
      },
      content: {
        required
      },
      category: {
        required
      }
    }))

    const v = useVuelidate(rules, { name, content, category })

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
        category.value = val.category
      }
    })

    const router = useRouter()

    async function save () {
      working.value = true
      page.value.name = name.value
      page.value.htmlContent = content.value
      page.value.category = category.value

      await savePage(page.value)

      router.push(`/site/${site.value.id}/page/${page.value.id}`)
      working.value = false
    }

    return { page, v, disableSaving, save, updated, working, opts, category, back }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass

.warning
  @include TypeBody2()
  padding: 8px
  background-color: var(--chroma-alert-field-tint)
  color: var(--chroma-alert)
  border-radius: 12px 0 12px 0
  margin-bottom: 8px
</style>
