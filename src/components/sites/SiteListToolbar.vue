<template>
  <div class="siteListToolbar">
    <Toolbar>
      <h3>{{ $t('wiki.title') }}</h3>
      <div class="spacer" />
      <Action
        v-if="!isAnonymous"
        to="mekanismi.profile.sites"
        prepend="books"
      >
        <span v-if="!mobile">{{ $t('wiki.mySites') }}</span>
      </Action>
      <Action
        v-if="!isAnonymous"
        to="mekanismi.create.site"
        prepend="add"
      >
        <span v-if="!mobile">{{ $t('wiki.createSite') }}</span>
      </Action>
      <Action
        prepend="filter"
        @click="filterToggle = !filterToggle"
      >
        <span class="hideOnMobile">{{ $t('site.filterSites') }}</span>
      </Action>
    </Toolbar>
    <Toolbar v-if="filterToggle">
      <p>{{ $t('site.filterSites') }}</p>
      <Pill
        prepend-icon="dd-logo"
        label="D&D"
      />
    </Toolbar>
  </div>
</template>

<script lang="ts">
import { useAuthState } from '@/state/authz'
import { ComputedRef, defineComponent, inject, ref, watch } from 'vue'
import Toolbar from '../layout/Toolbar.vue'
import Action from '../material/Action.vue'
import Pill from '../material/Pill.vue'

export default defineComponent({
  components: { Action, Toolbar, Pill },
  emits: ['update:filterTag'],
  setup (props, context) {
    const mobile = inject('mobileViewport') as ComputedRef<boolean>
    const filterToggle = ref(false)
    const filterTag = ref('')
    watch(() => filterTag, (val) => {
      context.emit('update:filterTag', val)
    })
    const setFilter = (f:string) => {
      filterTag.value = f
    }
    const { isAnonymous } = useAuthState()
    return { mobile, isAnonymous, filterToggle, setFilter }
  }
})
</script>
