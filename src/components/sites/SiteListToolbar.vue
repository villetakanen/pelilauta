<template>
  <div class="siteListToolbar">
    <Header>
      <ViewTitle icon="mekanismi">
        {{ $t('wiki.title') }}
      </ViewTitle>
      <SpacerDiv />
      <Button
        text
        @click="filterToggle = !filterToggle"
      >
        <Icon
          small
          name="filter"
        />
        <span class="hideOnMobile">{{ $t('site.filterSites') }}</span>
      </Button>
    </Header>
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
import Button from '../form/Button.vue'
import Header from '../layout/Header.vue'
import SpacerDiv from '../layout/SpacerDiv.vue'
import Toolbar from '../layout/Toolbar.vue'
import ViewTitle from '../layout/ViewTitle.vue'
import Chip from '../material/Chip.vue'
import Icon from '../material/Icon.vue'

export default defineComponent({
  components: { Toolbar, Chip, Header, ViewTitle, SpacerDiv, Button, Icon },
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
