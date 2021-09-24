<template>
  <Dialog v-model="showDialog">
    <Card>
      <h1>INJECT IMAGE MVP</h1>
      <MaterialButton @click="inject">
        TEST ME!
      </MaterialButton>
    </Card>
  </Dialog>
</template>
<script lang="ts">
import { IMAGE_TAG_INSERT_EVENT, IMAGE_UPLOAD_EVENT } from '@/composables/useQuill/imageModule'
import { defineComponent, onMounted, ref } from 'vue'
import Card from '../layout/Card.vue'
import Dialog from '../material/Dialog.vue'
import MaterialButton from '../material/MaterialButton.vue'

export default defineComponent({
  name: 'InserMediaDialog',
  components: { Dialog, Card, MaterialButton },
  setup () {
    const showDialog = ref(false)
    onMounted(() => {
      document.addEventListener(IMAGE_UPLOAD_EVENT, () => {
        console.debug('InserMediaDialog got', IMAGE_UPLOAD_EVENT)
        showDialog.value = true
      })
    })
    function inject () {
      console.debug('inject()')
      document.dispatchEvent(new CustomEvent(IMAGE_TAG_INSERT_EVENT, {
        detail: {
          url: 'aaa',
          alt: 'aa'
        }
      }))
    }
    return { showDialog, inject }
  }
})
</script>
