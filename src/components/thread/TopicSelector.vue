<template>
  <div class="topicSelector">
    <div @click="showSelector = true">
      <span class="label">{{ $t('stream.inStream') }}:</span> {{ topicName }}
      <Icon
        name="edit"
        inline
        class="onwhite"
      />
    </div>
    <div
      v-if="showSelector"
      class="selectDialog"
    >
      <template
        v-for="stream in streams"
        :key="stream.slug"
      >
        <h4
          v-if="stream.slug !== '-'"
          @click="select(stream.slug)"
        >
          <Icon
            headline
            :name="stream.icon"
          />&nbsp;{{ stream.name }}
        </h4>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { useMeta } from '@/state/meta'
import { computed, defineComponent, ref } from 'vue'
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
    const { streams } = useMeta()
    const topicName = computed(() => streams.value.find((s) => (s.slug === props.modelValue))?.name ?? '')
    const showSelector = ref(false)

    function select (v: string) {
      showSelector.value = false
      context.emit('update:modelValue', v)
    }

    return { topicName, streams, showSelector, select }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/box-shadow.sass

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
  position: relative
  white-space: nowrap
  .label
    color: var(--color-c-a)
  .onwhite
    background-color: var(--color-c-j)
    border-radius: 50%
  .selectDialog
    @include Rise3()
    position: absolute
    top: 16px
    left: 16px
    background-color: var(--color-c-j)
    padding: 8px
    h4
      margin: 2px
      padding-left: 4px
      padding-right: 12px
      &:hover
        background-color: var(--color-c-i)
</style>
