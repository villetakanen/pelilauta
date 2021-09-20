<template>
  <div class="topicSelector">
    <span class="label">{{ $t('stream.inStream') }}:</span> {{ topicName }}
    <Icon
      name="edit"
      inline
      class="onwhite"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import Icon from '../material/Icon.vue'

export default defineComponent({
  name: 'HamburgerMenuButton',
  components: { Icon },
  props: {
    modelValue: {
      type: String,
      required: false,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    const topicName = computed(() => props.modelValue)

    // context.emit('update:modelValue', toggled.value)

    return { topicName }
  }
})
</script>

<style lang="sass" scoped>
.topicSelector
  background-color: var(--color-c-g)
  line-height: 32px
  height: 32px
  display: inline-block
  margin: 2px 0
  padding: 0px 8px
  padding-right: 0
  border-radius: 16px
  font-size: 16px
  color: var(--color-as-a)
  .label
    color: var(--color-c-a)
  .onwhite
    background-color: var(--color-c-j)
    border-radius: 50%
</style>
