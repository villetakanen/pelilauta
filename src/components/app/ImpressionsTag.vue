<template>
  <div class="ImpressionsTag TypeBody">
    <Icon
      class="prepend"
      name="eye"
      xs
    />
    {{ seenCount }}
    <span class="hideOnMobile label">{{ $t('impressions.seenBy') }}</span>
  </div>
</template>

<script lang="ts">
import { ThreadClass } from '@/state/threads/threads'
import { Page } from '@/state/pages/Page'
import { computed, defineComponent, PropType } from 'vue'
import Icon from '../material/Icon.vue'

export default defineComponent({
  name: 'ImpressionsTag',
  components: { Icon },
  props: {
    entity: {
      type: Object as PropType<ThreadClass|Page>,
      required: true
    }
  },
  setup (props) {
    const type = computed(() => (Object.prototype.hasOwnProperty.call(props.entity, 'flowTime') ? 'thread' : 'page'))
    const seenCount = computed(() => props.entity?.seenCount || 0)
    return {
      type,
      seenCount
    }
  }
})
</script>

<style lang="sass" scoped>
.ImpressionsTag
  background-color: var(--chroma-secondary-i)
  padding: 0 12px
  padding-left: 24px
  border-radius: 16px
  position: relative
  .label
    color: var(--chroma-secondary-d)
  .icon.prepend
    position: absolute
    left: 4px
    top: 4px
</style>
