<template>
  <MaterialMenu
    :disabled="disabled"
    :model-value="menuItems"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useSite } from '@/state/site'
import MaterialMenu from '@/components/material/MaterialMenu.vue'
import { useAuth } from '@/state/authz'
import { MenuItem } from '@/utils/uiInterfaces'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  components: { MaterialMenu },
  setup () {
    const i18n = useI18n()
    const { user } = useAuth()
    const { site } = useSite()

    const disabled = computed(() => (!site.value.hasEditor(user.value.uid)))

    const menuItems = computed(() => {
      const items: MenuItem[] = []
      if (site.value.usePlayers) {
        items.push({
          text: i18n.t('site.keeper.title'),
          icon: 'keeper',
          to: '/site/' + site.value.id + '/keeper'
        })
      }
      if (site.value.hasOwner(user.value.uid)) {
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
