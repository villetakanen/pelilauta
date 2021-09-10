<template>
  <Dialog v-model="showDialog">
    <Card>
      <h1 class="title">
        {{ $t('rte.wikilink.Title') }}
      </h1>
      <TextField v-model="customUrl" />
      <TextField
        v-model="customUrlText"
        :label="customUrl"
      />
      <MaterialButton
        :action="sendUrl"
        :disabled="!urlValid"
        :label="$t('rte.wikilink.urlfield')"
      >
        {{ $t('action.add') }}
      </MaterialButton>
      <div v-if="site.name && site.name.length > 0">
        <hr>
        <MaterialSelect
          v-model="linkValue"
          :opts="pageOpts"
          :label="$t('rte.wikilink.pagefield')"
        />
        <MaterialButton :action="sendValue">
          {{ $t('action.add') }}
        </MaterialButton>
      </div>
    </Card>
  </Dialog>
</template>

<script lang="ts">
import { usePages, useSite } from '@/state/site'
import { computed, defineComponent, onMounted, ref } from 'vue'
import Card from '../layout/Card.vue'
import Dialog from '../material/Dialog.vue'
import MaterialButton from '../material/MaterialButton.vue'
import MaterialSelect from '../material/MaterialSelect.vue'
import TextField from '../material/TextField.vue'

export default defineComponent({
  components: { Dialog, Card, MaterialSelect, MaterialButton, TextField },
  setup () {
    const showDialog = ref(false)
    const linkValue = ref('')
    const customUrl = ref('')
    const customUrlText = ref('')
    const urlValid = computed(() => {
      if (!(customUrl.value.startsWith('https://') || customUrl.value.startsWith('http://'))) return false
      const c = new URL(customUrl.value)
      return (c.host.length > 1)
    })
    const { site } = useSite()
    const { pages } = usePages()
    const pageOpts = computed(() => {
      return pages.value.map((s) => ({ key: s.id, value: s.name }))
    })

    onMounted(() => {
      document.addEventListener('rte-wikilink-tool', () => {
        console.log('rte-wikilink-tool')
        showDialog.value = true
      })
    })

    function sendValue () {
      document.dispatchEvent(new CustomEvent('rte-post-link', {
        detail: {
          url: '/site/' + site.value.id + '/page/' + linkValue.value,
          text: pages.value.find((p) => (p.id === linkValue.value))?.name ?? 'xxx'
        }
      }
      ))
      showDialog.value = false
    }

    function sendUrl () {
      if (!urlValid.value) return
      document.dispatchEvent(new CustomEvent('rte-post-link', {
        detail: {
          url: customUrl.value,
          text: customUrlText.value ?? customUrl.value
        }
      }
      ))
      showDialog.value = false
    }

    return { showDialog, pageOpts, linkValue, sendValue, urlValid, customUrl, sendUrl, customUrlText, site }
  }
})
</script>
