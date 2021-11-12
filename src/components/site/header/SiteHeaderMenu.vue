<template>
  <MaterialMenu
    :disabled="disabled"
    :model-value="menuItems"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { SiteClass, useSite } from '@/state/site'
import MaterialMenu from '@/components/material/MaterialMenu.vue'
import { useAuth } from '@/state/authz'
import { MenuItem } from '@/utils/uiInterfaces'
import { useI18n } from 'vue-i18n'
import { logDebug } from '@/utils/eventLogger'

export default defineComponent({
  components: { MaterialMenu },
  setup () {
    const i18n = useI18n()
    const { user } = useAuth()
    const { site } = useSite()

    const siteClass = computed(() => {
      return new SiteClass(site.value)
    })
    const disabled = computed(() => (!siteClass.value.canEdit(user.value.uid)))

    const menuItems = computed(() => {
      const items: MenuItem[] = []
      if (siteClass.value.usePlayers) {
        items.push({
          text: i18n.t('site.keeper.title'),
          icon: 'keeper',
          to: '/site/' + site.value.id + '/keeper'
        })
      }
      if (siteClass.value.isOwner(user.value.uid)) {
        items.push({
          text: i18n.t('site.meta.title'),
          icon: 'equalizer',
          to: '/site/' + site.value.id + '/meta'
        })
        items.push({
          text: i18n.t('site.settings.title'),
          icon: 'settings',
          to: '/site/' + site.value.id + '/settings'
        })
      }
      return items
    })

    return { site, disabled, menuItems }
  }
})
</script>
