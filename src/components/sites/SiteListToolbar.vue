<template>
  <div class="siteListToolbar">
    <Toolbar>
      <h3>{{ $t('wiki.title') }}</h3>
      <div class="spacer" />
      <Action
        v-if="showMemberTools"
        to="mekanismi.profile.sites"
        prepend="books"
      >
        <span v-if="!mobile">{{ $t('wiki.mySites') }}</span>
      </Action>
      <Action
        v-if="showMemberTools"
        to="create.site"
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
    <Toolbar
      v-if="filterToggle"
      style="height: auto"
    >
      <h4 class="hideOnMobile">
        {{ $t('site.filterSites') }}
      </h4>
      <div class="spacer" />
      <div>
        <Chip
          label="Pelilauta / Mekanismi"
          icon="mekanismi"
          :secondary="filterTag !== 'mekanismi'"
          @click="setFilter('mekanismi')"
        />
        <Chip
          label="Dungeons & Dragpons"
          icon="dd-logo"
          :secondary="filterTag !== 'dd'"
          @click="setFilter('dd')"
        />
        <Chip
          label="Pathfinder"
          icon="pathfinder-logo"
          :secondary="filterTag !== 'pathfinder'"
          @click="setFilter('pathfinder')"
        />
        <Chip
          label="Quick"
          icon="quick-logo"
          :secondary="filterTag !== 'quick'"
          @click="setFilter('quick')"
        />
        <Chip
          label="Homebrew"
          icon="homebrew-logo"
          :secondary="filterTag !== 'homebrew'"
          @click="setFilter('homebrew')"
        />
      </div>
    </Toolbar>
  </div>
</template>

<script lang="ts">
import { useAuth } from '@/state/authz'
import { ComputedRef, defineComponent, inject, ref } from 'vue'
import Toolbar from '../layout/Toolbar.vue'
import Action from '../material/Action.vue'
import Chip from '../material/Chip.vue'

export default defineComponent({
  components: { Action, Toolbar, Chip },
  props: {
    filter: {
      type: String,
      required: false,
      default: ''
    }
  },
  emits: ['update:filterTag'],
  setup (props, context) {
    const mobile = inject('mobileViewport') as ComputedRef<boolean>
    const filterToggle = ref(false)
    const filterTag = ref(props.filter)

    const setFilter = (f:string) => {
      if (filterTag.value === f) filterTag.value = ''
      else filterTag.value = f
      context.emit('update:filterTag', filterTag.value)
    }
    const { showMemberTools } = useAuth()
    return { mobile, showMemberTools, filterToggle, setFilter, filterTag }
  }
})
</script>
