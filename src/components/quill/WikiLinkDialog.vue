<template>
  <Dialog
    v-model="showDialog"
    :label="$t('rte.wikilink.title') "
  >
    <div>
      <h1 class="hideOnMobile">
        {{ $t('rte.wikilink.title') }}
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
        <h1 class="title">
          {{ $t('rte.wikilink.inbound') }}
        </h1>
        <MaterialSelect
          v-model="linkValue"
          :opts="pageOpts"
          :label="$t('rte.wikilink.pagefield')"
        />
        <MaterialButton :action="sendValue">
          {{ $t('action.add') }}
        </MaterialButton>
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts">
import { usePages, useSite } from '@/state/site'
import { computed, defineComponent, onMounted, ref } from 'vue'
import Dialog from '../material/Dialog.vue'
import MaterialButton from '../material/MaterialButton.vue'
import MaterialSelect from '../material/MaterialSelect.vue'
import TextField from '../material/TextField.vue'

export default defineComponent({
  components: { Dialog, MaterialSelect, MaterialButton, TextField },
  emits: ['addLink'],
  setup (props, context) {
    const showDialog = ref(false)
    const linkValue = ref('')
    const customUrl = ref('')
    const customUrlText = ref('')
    const urlValid = computed(() => {
      if (!(customUrl.value.startsWith('https://') || customUrl.value.startsWith('http://'))) return false
      try {
        const c = new URL(customUrl.value)
        return (c.host.length > 1)
      } catch {
        return false
      }
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
      context.emit('addLink', {
        url: '/site/' + site.value.id + '/page/' + linkValue.value,
        text: pages.value.find((p) => (p.id === linkValue.value))?.name || linkValue.value
      })
      showDialog.value = false
    }

    function sendUrl () {
      if (!urlValid.value) return
      context.emit('addLink', {
        url: customUrl.value,
        text: customUrlText.value || customUrl.value
      }
      )
      showDialog.value = false
    }

    return { showDialog, pageOpts, linkValue, sendValue, urlValid, customUrl, sendUrl, customUrlText, site }
  }
})
</script>
