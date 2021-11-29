<template>
  <Select
    v-model="selectedSite"
    :opts="sites"
    :label="$t('character.meta.site')"
    :placeholder="$t('character.meta.site')"
    :loading="loading"
    :disabled="disabled"
    @input="onSiteChange"
  />
</template>

<script lang="ts">
import { useSites } from '@/state/sites'
import { computed, defineComponent, ref } from 'vue'
import Select from '../form/Select.vue'

export default defineComponent({
  components: { Select },
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    const localSite = ref(props.modelValue)
    const selectedSite = computed({
      get: () => localSite.value,
      set: (value) => {
        localSite.value = value
        context.emit('update:modelValue', value)
      }
    })

    const { userSites } = useSites()

    const sites = computed(() => {
      return new Map<string, string>(userSites.value.filter(
        site => site.usePlayers === true).map(
        site => [site.id, site.name]
      )
      )
    })

    return {
      selectedSite,
      sites
    }
  }
})
</script>
