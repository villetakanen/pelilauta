<template>
  <Column class="addSiteForm">
    <p>
      <Textfield
        v-model="v.name.$model"
        :error="v.name.$error"
        :label="$t('mekanismi.site.name')"
      />
    </p>
    <p><Textfield :label="$t('mekanismi.site.description')" /></p>
    <p>
      <Select
        v-model="type"
        name="SelectGameType"
        :opts="siteTypes"
        :label="$t('wiki.site.badge')"
      />
    </p>
    <p>
      <Toggle
        v-model="visible"
        :label="$t('wiki.site.visibleToggle')"
      />
    </p>
    <p>
      <Toggle
        v-model="visible"
        :label="$t('site.meta.usePlayers')"
      />
    </p>
    <div class="toolbar">
      <div class="spacer" />
      <Button
        text
        @click="back"
      >
        {{ $t('action.cancel') }}
      </Button>
      <Button
        :disabled="disableSaving"
        @click="save"
      >
        {{ $t('action.add') }}
      </Button>
    </div>
  </Column>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import Select from '../form/Select.vue'
import Textfield from '../form/Textfield.vue'
import Column from '../layout/Column.vue'
import Toggle from '../material/Toggle.vue'
import { siteTypes } from '@/state/site'
import { SiteDoc } from '@/state/store/Site'
import { createSite } from '@/state/sites'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import Button from '../form/Button.vue'
import { useUxActions } from '@/composables/useUxActions'

export default defineComponent({
  name: 'TextStyles',
  components: { Column, Toggle, Textfield, Select, Button },
  setup () {
    const { back, reroute } = useUxActions()
    const name = ref('')
    const description = ref('')
    const type = ref('')
    const visible = ref(false)
    const players = ref(false)
    const working = ref(false)

    const rules = computed(() => ({
      name: {
        required
      }
    }))

    const v = useVuelidate(rules, { name })

    const disableSaving = computed(() => {
      if (v.value.name.$error) return true
      return !v.value.name.$dirty
    })

    async function save () {
      working.value = true
      if (v.value.name.$error) return

      const siteData:SiteDoc = {
        id: '',
        name: name.value,
        description: description.value,
        hidden: !visible.value,
        usePlayers: players.value
      }

      const id = await createSite(siteData)

      reroute('/site/' + id)
      working.value = false
    }

    return { v, visible, siteTypes, description, type, players, back, save, disableSaving }
  }
})
</script>
