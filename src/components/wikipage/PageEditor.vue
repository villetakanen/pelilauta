<template>
  <div v-if="page.name === ''">
    <Loader poster />
  </div>
  <div v-else>
    <div class="pageEditor">
      <!-- Page info -->
      <div class="toolbar pageHeader">
        <TextField
          v-model="v.pageName.$model"
          header
          :label="$t('wiki.page.name')"
          :error="v.pageName.$error"
        />
        <MaterialSelect
          v-model="formCategory"
          :opts="opts"
          :label="$t('wiki.page.category')"
        />
        <MaterialButton icon>
          <Icon name="toggle-down" />
        </MaterialButton>
      </div>
      <!-- Page meta, toggled with metaToggle -->
      <!-- Page content -->
      <div class="editor">
        <QuillEditor
          v-model="pageContent"
          toolbar
        />
      </div>
      <!-- Editor actions -->
      <div
        class="toolbar"
        style="margin-top:8px"
      >
        <div class="spacer" />
        <MaterialButton
          text
          :to="`/mekanismi/view/${site.id}/${page.id}`"
        >
          Cancel
        </MaterialButton>
        <MaterialButton :async-action="save">
          Save
        </MaterialButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useSnack } from '@/composables/useSnack'
import { useAuthState } from '@/state/authz'
import { Page, PageFragment, Site, updatePage } from '@/state/site'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { minLength, maxLength, extractLinks, extractTags } from '@/utils/contentFormat'
import { defineComponent, PropType, ref, computed, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Loader from '../app/Loader.vue'
import Icon from '../material/Icon.vue'
import MaterialButton from '../material/MaterialButton.vue'
import MaterialSelect from '../material/MaterialSelect.vue'
import TextField from '../material/TextField.vue'
import QuillEditor from '../quill/QuillEditor.vue'

/**
 * An editor form for a Wiki Page.
 */
export default defineComponent({
  name: 'ThreadEditor',
  components: {
    MaterialSelect,
    MaterialButton,
    TextField,
    Icon,
    Loader,
    QuillEditor
  },
  props: {
    site: {
      type: Object as PropType<Site>,
      required: true
    },
    page: {
      type: Object as PropType<Page>,
      required: true
    }
  },
  setup (props) {
    const i18n = useI18n()
    // Page name
    const formName:Ref<string|undefined> = ref(undefined)
    const pageName = computed({
      get: () => (typeof formName.value === 'string' ? formName.value : props.page.name || props.page.id),
      set: (val:string) => {
        if (val !== formName.value) {
          formName.value = val
        } else {
          console.debug('Trying to set thread title to itself. This is likely a bug.')
        }
      }
    })

    // Page content
    const formContent:Ref<string|undefined> = ref(undefined)
    const pageContent = computed({
      get: () => (typeof formContent.value === 'string' ? formContent.value : props.page.htmlContent || '...'),
      set: (val:string) => {
        if (val !== formContent.value) {
          formContent.value = val
        } else {
          console.debug('Trying to set thread title to itself. This is likely a bug.')
        }
      }
    })

    const opts = [
      { key: 'characters', value: i18n.t('wiki.category.characters') },
      { key: 'logs', value: i18n.t('wiki.category.logs') },
      { key: 'rules', value: i18n.t('wiki.category.rules') },
      { key: 'setting', value: i18n.t('wiki.category.setting') }
    ]
    const formCategory = ref(props.page.category)

    const rules = {
      pageName: { required, minLength, maxLength }
    }
    const v = useVuelidate(rules, { pageName })

    const { uid } = useAuthState()
    const router = useRouter()
    const { pushSnack } = useSnack()

    async function save () {
      const { formattedContent: pc } = extractLinks(pageContent.value)
      const { formattedContent } = extractTags(pc)
      const pageData:PageFragment = {
        id: props.page.id,
        siteid: props.site.id,
        author: uid.value,
        category: formCategory.value
      }
      if (formName.value) pageData.name = formName.value
      if (formattedContent !== props.page.htmlContent) pageData.htmlContent = formattedContent
      return updatePage(pageData).then(() => {
        router.push(`/mekanismi/view/${props.site.id}/${props.page.id}`)
        pushSnack(i18n.t('wiki.page.updateSuccesfull'))
      }).catch((error:Error) => {
        pushSnack(i18n.t('wiki.page.updateFailed'))
        console.debug(error)
      })
    }
    return { save, v, opts, formCategory, pageContent }
  }
})
</script>

<style lang="sass" scoped>

.editor
  border-top: solid 1px var(--color-fill-primary)
  border-bottom: solid 1px var(--color-fill-primary)
.pageHeader
  margin-bottom: 8px
  div
    margin: 0
  div+div
    margin: 0 8px
</style>
