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
          class="pageName"
        />
        <MaterialSelect
          v-model="formCategory"
          :opts="opts"
          :label="$t('wiki.page.category')"
          class="pageCategory"
        />
        <MaterialButton
          id="pageEditorToggleEditorButton"
          icon
          :action="toggleEditor"
        >
          <Icon name="equalizer" />
        </MaterialButton>
      </div>
      <!-- Page meta, toggled with editorOptions/toggleEditor -->
      <div
        v-if="editorOptions"
        class="editorOptions"
      >
        <MaterialButton
          id="pageEditorDeleteButton"
          text
          @click="toggleDelete"
        >
          {{ $t('action.delete') }}
        </MaterialButton>
        <Dialog v-model="deleteDialog">
          <Card>
            <h3>{{ $t('action.delete') }}</h3>
            <p>{{ $t('wiki.page.deleteWarning') }}</p>
            <TextField
              id="pageEditorDeleteVerifyField"
              v-model="deleteConfirm"
            />
            <div class="toolbar">
              <div class="spacer" />
              <MaterialButton
                id="pageEditorDeleteVerifyButton"
                :disabled="deleteConfirm !== 'DELETE'"
                @click="deletePage"
              >
                {{ $t('action.delete') }}
              </MaterialButton>
              <MaterialButton @click="toggleDelete">
                {{ $t('action.cancel') }}
              </MaterialButton>
            </div>
          </Card>
        </Dialog>
      </div>
      <!-- Page content -->
      <div class="editor">
        <QuillEditor
          v-model="pageContent"
          toolbar
          class="pageContent"
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
import { Page, PageFragment, Site, updatePage, deletePage as deletePageFromFirestore } from '@/state/site'
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
import Dialog from '../material/Dialog.vue'
import Card from '../layout/Card.vue'

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
    QuillEditor,
    Dialog,
    Card
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
    const editorOptions = ref(false)
    const toggleEditor = () => {
      editorOptions.value = !editorOptions.value
    }
    const deleteDialog = ref(false)
    const deleteConfirm = ref('')
    const toggleDelete = () => {
      deleteConfirm.value = ''
      deleteDialog.value = !deleteDialog.value
    }
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
    async function deletePage () {
      if (deleteConfirm.value !== 'DELETE') return
      console.debug('deleting page')
      try {
        if (props.page.siteid === props.page.id) throw new Error('Can not delete site root page, without deleting the site')
        await deletePageFromFirestore(props.page.siteid, props.page.id)
        router.push(`/mekanismi/view/${props.site.id}/${props.site.id}`)
        pushSnack(i18n.t('wiki.page.deleteSuccess'))
      } catch (error) {
        console.debug(error)
        pushSnack(i18n.t('wiki.page.deleteFail'))
      }
    }
    return { save, v, opts, formCategory, pageContent, toggleEditor, editorOptions, deleteDialog, toggleDelete, deleteConfirm, deletePage }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss

.editor
  border-top: solid 1px var(--color-fill-primary)
  border-bottom: solid 1px var(--color-fill-primary)
.pageHeader
  margin-bottom: 8px
  div
    margin: 0
  div+div
    margin: 0 8px

@include media('<tablet')
  .pageHeader
    flex-direction: row
    flex-wrap: wrap
    align-items: flex-start
    .pageName
      width: calc(100vw - 16px)
      margin-bottom: 8px
    .pageCategory
      margin: 0
    margin-bottom: 0
  .pageContent
    min-height: 128px
</style>
