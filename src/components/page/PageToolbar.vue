<template>
  <Toolbar
    id="pageToolbar"
  >
    <Icon
      :name="site.systemBadge + '-logo'"
      headline
      class="systemBadge"
    />
    <div class="clipWithEllipsis">
      <h3 class="siteTitle">
        <router-link
          :to="`/mekanismi/view/${site.id}/${site.id}`"
        >
          {{ site.name }}
        </router-link>
      </h3>
      <h3 class="pageTitle">
        {{ title }}
      </h3>
    </div>
    <div class="spacer" />
    <Action
      prepend="share"
      @click="copyLink"
    >
      <span class="onlyForDesktop">{{ $t('action.share') }}</span>
    </Action>
  </Toolbar>
</template>

<script lang="ts">
import { useSite } from '@/state/site'
import { defineComponent } from 'vue'
import { useCopyLinkToClipboard } from '@/composables/useCopyURLToClipboard'
import Toolbar from '../layout/Toolbar.vue'
import Action from '../material/Action.vue'
import Icon from '../material/Icon.vue'

export default defineComponent({
  components: { Toolbar, Action, Icon },
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup () {
    const { site } = useSite()
    const copyLink = useCopyLinkToClipboard()

    return { site, copyLink }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-typography.sass

#pageToolbar
  .siteTitle
    @include TypeCaption()
    a
      color: var(--chroma-secondary-d)
  .pageTitle
    @include TypeHeadline5()
    margin-top:0
    padding-top:0

</style>
