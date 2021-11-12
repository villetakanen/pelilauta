<template>
  <Header
    id="siteToolbar"
  >
    <ViewTitle
      :icon="site.systemBadge + '-logo'"
    >
      {{ site.name }}
    </ViewTitle>

    <SpacerDiv />

    <ShareButton />
  </Header>
</template>

<script lang="ts">
import { Page, useSite } from '@/state/site'
import { computed, defineComponent, PropType } from 'vue'
import { useAuth } from '@/state/authz'
import Header from '../layout/Header.vue'
import SpacerDiv from '../layout/SpacerDiv.vue'
import ViewTitle from '../layout/ViewTitle.vue'
import { useUxActions } from '@/composables/useUxActions'
import ShareButton from '../actions/ShareButton.vue'

export default defineComponent({
  components: { Header, SpacerDiv, ViewTitle, ShareButton },
  props: {
    page: {
      type: Object as PropType<Page>,
      required: false,
      default: null
    }
  },
  setup () {
    const { site, members } = useSite()
    const { user } = useAuth()
    const { copyLinkToClipboard, reroute } = useUxActions()

    const owns = computed(() => (site.value.owners && site.value.owners.includes(user.value.uid)))
    const memberOf = computed(() => (members.value.findIndex((a) => (a.uid === user.value.uid)) > -1))
    return { site, owns, memberOf, copyLinkToClipboard, reroute }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-typography.sass

#siteToolbar
  //background-color: red
  margin: 0
  padding: 0 4px
  .pageIdentity
    position: relative
    margin: 0
    padding: 0
    padding-left: 52px

@include media('<tablet')
  #siteToolbar
    border-bottom: solid 1px var(--color-b-h)

.pageIdentity
  .systemBadge
    position: absolute
    top: 0
    left: 0
    margin: 0
    padding: 0
  .subject
    @include TypeCaption()
    margin: 0
    padding: 0
    line-height: 12px
    padding-top: 4px
    a
      color: var(--color-a-g)
      text-decoration: none
  .pagetitle
    @include TypeHeadline5()
    padding: 0
    margin: 0
    line-height: 32px
    a
      color: var(--color-a-a)
      text-decoration: none

@include media('<tablet')
  div.appToolbar.siteToolbar
    flex-wrap: wrap
    height: auto
    max-height: auto
    margin-bottom: 0
    .pageIdentity
      width: 100%
      .subject, .pagetitle
        white-space: normal

</style>
