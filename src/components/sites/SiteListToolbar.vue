<template>
  <div class="siteListToolbar">
    <h3>{{ $t('wiki.title') }}</h3>
    <div class="spacer" />
    <Action to="mekanismi.create.site">
      <span v-if="!mobile">{{ $t('wiki.createSite') }}</span>
      <template #prepend>
        <Icon name="add" />
      </template>
    </Action>
  </div>
</template>

<script lang="ts">
import { ComputedRef, defineComponent, inject } from 'vue'
import Action from '../material/Action.vue'
import Icon from '../material/Icon.vue'

export default defineComponent({
  components: { Action, Icon },
  setup () {
    const mobile = inject('mobileViewPort') as ComputedRef<boolean>
    return { mobile }
  }
})
</script>

<style lang="sass" scoped>
div.siteListToolbar
  display: flex
  .spacer
    flex-grow: 1
  h3
    line-height: 48px
</style>
