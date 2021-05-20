<template>
  <div class="siteOwnersTool">
    <h1 class="title">
      {{ $t('site.settings.access.ownersToolTitle') }}
    </h1>
    <p class="tooltip">
      {{ $t('site.settings.access.ownersTooltip') }}
    </p>
    <div class="ownerChips">
      <OwnerChip
        v-for="o in site.owners"
        :key="o"
        :uid="o"
      />
    </div>
    <div>
      <MaterialSelect
        v-model="added"
        :opts="availableAuthors"
      />
      <MaterialButton
        :disabled="!added"
        :async-action="setOwner"
      >
        {{ $t('action.add') }}
      </MaterialButton>
    </div>
  </div>
</template>

<script lang="ts">
import MaterialButton from '@/components/material/MaterialButton.vue'
import MaterialSelect from '@/components/material/MaterialSelect.vue'
import { useAuthors } from '@/state/authors'
import { Site, useSite } from '@/state/site'
import { computed, defineComponent, PropType, ref } from 'vue'
import OwnerChip from './OwnerChip.vue'

export default defineComponent({
  components: { OwnerChip, MaterialSelect, MaterialButton },
  props: {
    site: {
      type: Object as PropType<Site>,
      required: true
    }
  },
  setup (props) {
    const { nonFrozenAuthors } = useAuthors()
    const { addOwner } = useSite()
    const added = ref('')
    const availableAuthors = computed(() => (nonFrozenAuthors.value.map((a) => ({
      key: a.uid || '',
      value: a.nick || ''
    }))).filter((a) => (!props.site.owners?.includes(a.key))).sort((a, b) => (a.value < b.value ? -1 : 1)))

    const setOwner = async () => {
      return addOwner(added.value)
    }

    return { added, availableAuthors, setOwner }
  }
})
</script>
