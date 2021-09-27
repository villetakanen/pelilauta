<template>
  <Column class="textStyles">
    <h1>Iconography</h1>
    <p>
      <Toggle
        v-model="onDark"
        label="Show icons on top of #002337 (instead of #FFF)"
      />
    </p>
    <p>
      <Toggle
        v-model="darkIcons"
        label="Show 'dark' icons"
      />
    </p><div
      class="iconlist"
      :class="{ onDark: onDark }"
    >
      <div
        v-for="icon in icons"
        :key="icon"
      >
        <Icon
          :name="icon"
          headline
          :dark="darkIcons"
        />
        <p class="TypeBody2">
          {{ icon }}
        </p>
      </div>
    </div>
  </Column>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Column from '../layout/Column.vue'
import Toggle from '../material/Toggle.vue'
import iconslist from '@/components/material/iconslist.json'
import Icon from '../material/Icon.vue'

export default defineComponent({
  name: 'TextStyles',
  components: { Column, Toggle, Icon },
  setup () {
    const onDark = ref(false)
    const darkIcons = ref(false)
    const icons = ref([...iconslist.icons])
    return { onDark, icons, darkIcons }
  }
})
</script>

<style lang="sass" scoped>
.iconlist
  background-color: #fff
  display: flex
  flex-wrap: wrap
  padding: 8px
  gap: 4px
  .icon
    display: block
    margin: 0 auto
  div
    flex-grow: 0
    flex-shrink: 0
    width: 72px
    p
      text-align: center
      word-break: break-all
  &.onDark
    background-color: #002337
    p
      color: var(--chroma-secondary-g)
</style>
