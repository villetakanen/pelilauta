<template>
  <Card class="profileActions">
    <h3>{{ $t('profile.actions.title') }}</h3>
    <p>{{ $t('profile.actions.helper') }}</p>
    <div>
      {{ $t('profile.actions.selectLang') }}
      <MaterialSelect
        v-model="selectedLang"
        :opts="langs"
      />
    </div>
    <MaterialButton
      :action="stampAllSeen"
    >
      {{ $t('action.markAllRead') }}
    </MaterialButton>
    <div class="toolbar">
      <div class="spacer" />
      <MaterialButton
        text
        :action="logout"
      >
        {{ $t('action.logout') }}
      </MaterialButton>
    </div>
  </Card>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import { useRouter } from 'vue-router'
import firebase from 'firebase/app'
import 'firebase/auth'
import { useProfile } from '@/state/authz'
import MaterialSelect from '../material/MaterialSelect.vue'
import { useI18n } from 'vue-i18n'
import { useSnack } from '@/composables/useSnack'
import Card from '../layout/Card.vue'

export default defineComponent({
  name: 'ProfileActions',
  components: {
    MaterialButton,
    MaterialSelect,
    Card
  },
  setup () {
    const i18n = useI18n()
    const router = useRouter()

    const logout = () => {
      firebase.auth().signOut().then(() => {
        router.push('/')
      })
    }

    function stampAllSeen () {
      const { markAllThreadsRead } = useProfile()
      markAllThreadsRead()
    }

    const langs = [
      { key: 'fi', value: i18n.t('language.fi') },
      { key: 'en', value: i18n.t('language.en') }
    ]

    const { profileMeta, switchLang } = useProfile()
    const selectedLang = ref(profileMeta.value.pelilautaLang || 'fi')
    const { pushSnack } = useSnack()

    watch(selectedLang, (currentValue) => {
      switchLang(currentValue).then(() => {
        pushSnack(i18n.t('snacks.languageUpdate') + ' ' + i18n.t('language.' + currentValue))
      })
    })

    return { logout, stampAllSeen, langs, selectedLang }
  }
})
</script>
