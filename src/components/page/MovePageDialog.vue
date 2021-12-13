<template>
  <Dialog v-model="visible">
    <Toolbar>
      <Select
        v-model="selected"
        name="movePageSelector"
        :opts="opts"
      />
      <SpacerDiv />
      <Button
        @click="onClick"
      >
        {{ $t('action.move') }}
      </Button>
    </Toolbar>
  </Dialog>
</template>

<script lang="ts">
import { useUxActions } from '@/composables/useUxActions'
import { usePage } from '@/state/pages/usePage'
import { useSite } from '@/state/site'
import { useSites } from '@/state/sites'
import { computed, defineComponent, onMounted, ref } from 'vue'
import Button from '../form/Button.vue'
import Select from '../form/Select.vue'
import SpacerDiv from '../layout/SpacerDiv.vue'
import Toolbar from '../layout/Toolbar.vue'
import Dialog from '../material/Dialog.vue'

export default defineComponent({
  components: { Dialog, Select, Button, Toolbar, SpacerDiv },
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    const { site } = useSite()
    const { userSites } = useSites()
    const { page, movePage } = usePage()
    const { reroute } = useUxActions()

    const selected = ref(site.value.id)

    const visible = computed({
      get: () => props.modelValue,
      set: (value: boolean) => {
        context.emit('update:modelValue', value)
      }
    })

    const opts = computed(() => userSites.value.map(site => ([site.id, site.name])))

    const pageid = ref('')
    onMounted(() => {
      pageid.value = page.value.id
    })

    async function onClick () {
      await movePage(selected.value)
      visible.value = false
      reroute('/site/' + selected.value + '/page/' + pageid.value)
    }

    return {
      onClick,
      visible,
      opts,
      selected
    }
  }
})
</script>
