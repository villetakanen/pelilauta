<template>
  <Dialog v-model="showDialog">
    <Card>
      <MaterialSelect
        v-model="linkValue"
        :opts="pageOpts"
      />
      <MaterialButton :action="sendValue">
        {{ $t('action.add') }}
      </MaterialButton>
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

export default defineComponent({
  components: { Dialog, Card, MaterialSelect, MaterialButton },
  setup () {
    const showDialog = ref(false)
    const linkValue = ref('')
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

    return { showDialog, pageOpts, linkValue, sendValue }
  }
})
</script>
