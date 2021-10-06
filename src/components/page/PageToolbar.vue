<template>
  <Toolbar
    id="pageToolbar"
  >
    <div class="title">
      <Icon
        :name="site.systemBadge + '-logo'"
        headline
        class="badge"
      />
      <h3 class="siteTitle clipWithEllipsis">
        <router-link
          :to="`/site/${site.id}`"
        >
          {{ site.name }}
        </router-link>
      </h3>
      <h3 class="pageTitle clipWithEllipsis">
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
  .title
    position: relative
    margin: 0
    padding: 0
    padding-left: 56px
    .badge
      position: absolute
      top: 0
      left: 0
  .siteTitle
    @include TypeCaption()
    a
      color: var(--chroma-secondary-d)
  .pageTitle
    @include TypeHeadline5()
    margin-top:0
    padding-top:0
    height: 1em
    white-space: nowrap
    padding-bottom: 8px
    margin-bottom: -8px
    max-width: calc(100vw - 70px)

@include media('>=tablet')
#pageToolbar
  .pageTitle
    max-width: auto
</style>
