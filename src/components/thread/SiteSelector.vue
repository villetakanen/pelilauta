<template>
  <div class="siteSelector">
    <div v-if="siteName">
      {{ siteName }}
      <Icon
        :name="siteBadge"
        inline
        class="onwhite"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { useSites } from '@/state/sites'
import { computed, defineComponent } from 'vue'
import Icon from '../material/Icon.vue'

export default defineComponent({
  name: 'SiteSelector',
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
    const { allSites } = useSites()
    const siteName = computed(() => allSites.value.find((s) => (s.id === props.modelValue))?.name ?? '')
    const siteBadge = computed(() => allSites.value.find((s) => (s.id === props.modelValue))?.systemBadge + '-logo' ?? '')

    return { siteName, siteBadge }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/box-shadow.sass

.siteSelector
  background-color: var(--color-f-f)
  line-height: 32px
  height: 32px
  display: inline-block
  margin: 2px 0
  padding: 0px 8px
  padding-right: 0
  border-radius: 16px
  font-size: 16px
  color: var(--color-a-a)
  position: relative
  white-space: nowrap
  .label
    color: var(--color-f-a)
  .onwhite
    background-color: var(--color-f-j)
    border-radius: 50%
  .selectDialog
    @include Rise3()
    position: absolute
    z-index: 1000
    top: 16px
    left: 16px
    background-color: var(--color-f-j)
    padding: 8px
    h4
      margin: 2px
      padding-left: 4px
      padding-right: 12px
      &:hover
        background-color: var(--color-f-i)
</style>
