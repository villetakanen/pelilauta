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

    <Action
      prepend="share"
      @click="copyLink"
    >
      <span class="onlyForDesktop">{{ $t('action.share') }}</span>
    </Action>
    <Action
      v-if="memberOf"
      prepend="attachments"
      :to="`/site/attachments/${site.id}/`"
    >
      <span class="onlyForDesktop">{{ $t('mekanismi.attachments.title') }}</span>
    </Action>
    <Action
      v-if="site.usePlayers && memberOf"
      prepend="players"
      :to="`/site/players/${site.id}/`"
    >
      <span class="onlyForDesktop">{{ $t('site.players.title') }}</span>
    </Action>
    <Action
      v-if="site.usePlayers && memberOf"
      prepend="keeper"
      :to="`/site/${site.id}/keeper`"
    >
      <span class="onlyForDesktop">{{ $t('site.keeper.title') }}</span>
    </Action>
    <Action
      v-if="owns"
      prepend="equalizer"
      :to="`/site/meta/${site.id}`"
    >
      <span class="onlyForDesktop">{{ $t('mekanismi.siteinfo') }}</span>
    </Action>
    <Action
      v-if="owns"
      prepend="settings"
      :to="`/site/settings/${site.id}`"
    >
      <span class="onlyForDesktop">{{ $t('site.settings.title') }}</span>
    </Action>
  </Header>
</template>

<script lang="ts">
import { Page, useSite } from '@/state/site'
import { computed, defineComponent, PropType } from 'vue'
import { copyUrl } from '@/utils/window'
import Action from '../material/Action.vue'
import { useSnack } from '@/composables/useSnack'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/state/authz'
import Header from '../layout/Header.vue'
import SpacerDiv from '../layout/SpacerDiv.vue'
import ViewTitle from '../layout/ViewTitle.vue'

export default defineComponent({
  components: { Action, Header, SpacerDiv, ViewTitle },
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

    const i18n = useI18n()
    const { pushSnack } = useSnack()
    const copyLink = () => {
      copyUrl()
      pushSnack({ topic: i18n.t('global.messages.linkShared') })
    }
    const owns = computed(() => (site.value.owners && site.value.owners.includes(user.value.uid)))
    const memberOf = computed(() => (members.value.findIndex((a) => (a.uid === user.value.uid)) > -1))
    return { site, copyLink, owns, memberOf }
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
