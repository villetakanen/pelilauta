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
        <MaterialSelect />
        <MaterialButton icon>
          <Icon name="toggle-down" />
        </MaterialButton>
      </div>
      <!-- Page meta, toggled with metaToggle -->
      <!-- Page content -->
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
      <div>{{ site }}</div>
      <hr>
      <div>{{ page }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { useSnack } from '@/composables/useSnack'
import { useAuthState } from '@/state/authz'
import { Page, PageFragment, Site, updatePage } from '@/state/site'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { minLength, maxLength } from '@/utils/contentFormat'
// import { extractLinks, extractTags } from '@/utils/contentFormat'
import { defineComponent, PropType, ref, computed, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Loader from '../app/Loader.vue'
import Icon from '../material/Icon.vue'
import MaterialButton from '../material/MaterialButton.vue'
import MaterialSelect from '../material/MaterialSelect.vue'
import TextField from '../material/TextField.vue'

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
    Loader
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
    // Thread name
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

    const rules = {
      pageName: { required, minLength, maxLength }
    }
    const v = useVuelidate(rules, { pageName })

    const { uid } = useAuthState()
    const router = useRouter()
    const { pushSnack } = useSnack()
    const i18n = useI18n()

    async function save () {
      // const { formattedContent: pc } = extractLinks(pageContent.value)
      // const { formattedContent, tags } = extractTags(pc)
      const pageData:PageFragment = {
        id: props.page.id,
        siteid: props.site.id,
        author: uid.value
      }
      if (formName.value) pageData.name = formName.value
      return updatePage(pageData).then(() => {
        router.push(`/mekanismi/view/${props.site.id}/${props.page.id}`)
        pushSnack(i18n.t('wiki.page.updateSuccesfull'))
      }).catch((error:Error) => {
        pushSnack(i18n.t('wiki.page.updateFailed'))
        console.debug(error)
      })
    }
    return { save, v }
  }
})
</script>

<style lang="sass" scoped>

.editor
  border: solid 1px var(--color-fill-primary)
.pageHeader
  margin-bottom: 8px
  div
    margin: 0
  div+div
    margin: 0 8px
</style>
