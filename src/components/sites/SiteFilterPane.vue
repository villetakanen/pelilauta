<template>
  <div class="SiteFilterPane">
    <Icon
      small
      name="filter"
      style="margin-right: 12px;"
    />
    <!-- FilterChip :label="$t('action.filter.mySites')" @click="onClick('action.filter.mySites')" />
    <FilterChip :label="$t('action.filter.gamesIPlayIn')" @click="onClick('action.filter.gamesIPlayIn')" / -->
    <FilterChip
      v-for="theme in siteThemes"
      :key="theme.id"
      :label="theme.name"
      @click="onClick(theme.id)"
    />
  </div>
</template>

<script lang="ts">
import { useMeta } from '@/state/meta'
import { defineComponent, PropType, ref } from 'vue'
import Icon from '../material/Icon.vue'
import FilterChip from '../material3/FilterChip.vue'

export default defineComponent({
  name: 'SiteFilterPane',
  components: { FilterChip, Icon },
  props: {
    modelValue: {
      type: Array as PropType<string[]>,
      required: false,
      default: () => []
    }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    const selectedThemes = ref(props.modelValue)
    const { siteThemes } = useMeta()
    function onClick (theme: string) {
      if (selectedThemes.value.includes(theme)) {
        selectedThemes.value = selectedThemes.value.filter(t => t !== theme)
      } else {
        selectedThemes.value.push(theme)
      }
      context.emit('update:modelValue', selectedThemes.value)
    }
    return {
      siteThemes,
      selectedThemes,
      onClick
    }
  }
})
</script>
