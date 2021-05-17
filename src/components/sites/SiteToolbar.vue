<template>
  <Toolbar class="siteToolbar">
    <div class="pageIdentity clipWithEllipsis">
      <router-link
        :to="`/mekanismi/view/${site.id}/${site.id}`"
      >
        <Icon
          :name="site.systemBadge + '-logo'"
          headline
          class="systemBadge"
        />
      </router-link>
      <template v-if="page">
        <p class="subject">
          <router-link
            :to="`/mekanismi/view/${site.id}/${site.id}`"
          >
            {{ site.name }}
          </router-link>
        </p>
        <p class="pagetitle">
          <router-link
            :to="`/mekanismi/view/${site.id}/${page.id}`"
          >
            {{ page.name }}
          </router-link>
        </p>
      </template>
      <template v-else>
        <h3 class="sitetitle">
          <router-link
            :to="`/mekanismi/view/${site.id}/${site.id}`"
          >
            {{ site.name }}
          </router-link>
        </h3>
      </template>
    </div>
    <div class="spacer" />
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
  </Toolbar>
</template>

<script lang="ts">
import { Page, useSite } from '@/state/site'
import { computed, defineComponent, PropType } from 'vue'
import { copyUrl } from '@/utils/window'
import Toolbar from '../layout/Toolbar.vue'
import Action from '../material/Action.vue'
import { useSnack } from '@/composables/useSnack'
import { useI18n } from 'vue-i18n'
import Icon from '../material/Icon.vue'
import { useAuthState } from '@/state/authz'

export default defineComponent({
  components: { Toolbar, Action, Icon },
  props: {
    page: {
      type: Object as PropType<Page>,
      required: false,
      default: null
    }
  },
  setup () {
    const { site, members } = useSite()
    const { uid } = useAuthState()

    const i18n = useI18n()
    const { pushSnack } = useSnack()
    const copyLink = () => {
      copyUrl()
      pushSnack({ topic: i18n.t('global.messages.linkShared') })
    }
    const owns = computed(() => (site.value.owners && site.value.owners.includes(uid.value)))
    const memberOf = computed(() => (members.value.findIndex((a) => (a.uid === uid.value)) > -1))
    return { site, copyLink, owns, memberOf }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-typography.sass

div.appToolbar.siteToolbar
  margin-left: 8px
  padding-left: 0
  margin-bottom: 0

.pageIdentity
  position: relative
  padding-left: 52px
  .systemBadge
    position: absolute
    top: 0
    left: 0
    margin: 0
    padding: 0
  .subject
    @include TypeBody2()
    line-height: 16px
    a
      color: var(--chroma-secondary-f)
  .pagetitle
    @include TypeHeadline5()
    line-height: 32px
    a
      color: var(--chroma-secondary-a)
  .subject, .pagetitle
    white-space: nowrap
    padding: 0
    margin: 0
    a
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
