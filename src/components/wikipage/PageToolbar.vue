<template>
  <div class="toolbar">
    <div>
      <h1 class="subtitle">
        {{ subtitle }}
      </h1>
      <h1>{{ title }}</h1>
    </div>
    <div class="spacer" />
    <MaterialButton
      icon
      color="tertiary"
    >
      <img
        src="@/assets/icons/share.svg"
        alt="share icon"
      >
    </MaterialButton>
    <MaterialButton
      icon
      color="tertiary"
      :to="`/mekanismi/edit/${siteid}/${pageid}`"
    >
      <img
        src="@/assets/icons/edit.svg"
        alt="edit icon"
      >
    </MaterialButton>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'PageToolbar',
  components: {
    MaterialButton
  },
  props: {
    title: {
      type: String,
      required: false,
      default: 'Mekanismi'
    },
    subtitle: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup () {
    const route = useRoute()
    const pageid = computed(() => {
      return Array.isArray(route.params.pageid) ? route.params.pageid[0] : route.params.pageid || siteid.value
    })
    const siteid = computed(() => {
      return Array.isArray(route.params.siteid) ? route.params.siteid[0] : route.params.siteid
    })
    return { siteid, pageid }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass
@import @/styles/layout.sass
@import @/styles/include-media.scss

.toolbar
  margin-bottom: 8px
  h1
    @include TypeButton()
    font-size: 22px
    line-height: 32px
    color: $color-fill-primary-dark
    &.subtitle
      @include TypeButton()
      font-size: 12px
      line-height: 16px
</style>
