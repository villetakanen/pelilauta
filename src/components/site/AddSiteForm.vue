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
      <Button @click="save">
        {{ $t('action.save') }}
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

    const rules = computed(() => ({
      name: {
        required
      }
    }))

    const v = useVuelidate(rules, { name })

    function save () {
      reroute('/')
    }

    return { v, visible, siteTypes, description, type, players, back, save }
  }
})
</script>
