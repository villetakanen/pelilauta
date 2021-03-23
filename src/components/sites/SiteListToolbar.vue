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
    <Toolbar v-if="filterToggle" style="height: auto">
      <h4 class="hideOnMobile">{{ $t('site.filterSites') }}</h4>
      <div class="spacer" />
      <div>
        <Chip
          label="Pelilauta / Mekanismi"
          icon="mekanismi"
          :secondary="filterTag !== 'site'"
          @click="filterTag = 'site'"
        />
        <Chip
          label="Dungeons & Dragpons"
          icon="dd-logo"
          :secondary="filterTag !== 'dd'"
          @click="filterTag = 'dd'"
        />
        <Chip
          label="Pathfinder"
          icon="pathfinder-logo"
          :secondary="filterTag !== 'pathfinder'"
          @click="filterTag = 'pathfinder'"
        />
        <Chip
          label="Quick"
          icon="quick-logo"
          :secondary="filterTag !== 'quick'"
          @click="filterTag = 'quick'"
        />
      </div>
    </Toolbar>
  </div>
</template>

<script lang="ts">
import { useAuthState } from '@/state/authz'
import { ComputedRef, defineComponent, inject, ref, watch } from 'vue'
import Toolbar from '../layout/Toolbar.vue'
import Action from '../material/Action.vue'
import Chip from '../material/Chip.vue'

export default defineComponent({
  components: { Action, Toolbar, Chip },
  emits: ['update:filterTag'],
  setup (props, context) {
    const mobile = inject('mobileViewport') as ComputedRef<boolean>
    const filterToggle = ref(true)
    const filterTag = ref('')
    watch(() => filterTag, (val) => {
      context.emit('update:filterTag', val)
    })
    const setFilter = (f:string) => {
      filterTag.value = f
    }
    const { isAnonymous } = useAuthState()
    return { mobile, isAnonymous, filterToggle, setFilter, filterTag }
  }
})
</script>
