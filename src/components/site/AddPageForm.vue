<template>
  <div class="addPageForm">
    <h3>{{ $t('site.actions.addPage') }}</h3>
    <TextField :label="$t('site.page.title')" />
    <p>{{ $t('site.page.adress') }}: <span class="mockURL">{{ address }}</span></p>
    <div class="toolbar">
      <div class="spacer" />
      <MaterialButton
        text
        :action="cancel"
      >
        {{ $t('action.cancel') }}
      </MaterialButton>
      <MaterialButton>{{ $t('action.add') }}</MaterialButton>
    </div>
  </div>
</template>

<script lang="ts">
import { useSite } from '@/state/site'
import { computed, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import MaterialButton from '../material/MaterialButton.vue'
import TextField from '../material/TextField.vue'

export default defineComponent({
  name: 'AddPageForm',
  components: {
    TextField,
    MaterialButton
  },
  setup () {
    const { site } = useSite()
    const router = useRouter()

    const address = computed(() => {
      return `${window.location.hostname}/mekanismi/view/${site.value.id}/`
    })
    function cancel () {
      router.back()
    }
    return { address, cancel }
  }
})
</script>

<style lang="sass" scoped>
.mockURL
  color: var(--chroma-primary-d)
</style>
