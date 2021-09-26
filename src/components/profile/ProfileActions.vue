<template>
  <Card class="profileActions">
    <h3>{{ $t('profile.actions.title') }}</h3>
    <p>{{ $t('profile.actions.helper') }}</p>
    <div>
      <Select
        v-model="selectedLang"
        name="selectLanguage"
        :label="$t('profile.actions.selectLang')"
        :opts="langs"
      />
    </div>
    <MaterialButton
      :action="stampAllSeen"
    >
      {{ $t('action.markAllRead') }}
    </MaterialButton>
    <div class="toolbar">
      <MaterialButton
        text
        @click="forgetMeDialog = true"
      >
        {{ $t('action.forgetMe') }}
      </MaterialButton>

      <div class="spacer" />
      <MaterialButton
        text
        :action="logout"
      >
        {{ $t('action.logout') }}
      </MaterialButton>
    </div>
    <Dialog v-model="forgetMeDialog">
      <Card>
        <h3>{{ $t('action.delete') }}</h3>
        <p>{{ $t('profile.deleteWarning') }}</p>
        <TextField
          id="pageEditorDeleteVerifyField"
          v-model="forgetMeConfirm"
        />
        <div class="toolbar">
          <div class="spacer" />
          <MaterialButton
            id="pageEditorDeleteVerifyButton"
            :disabled="forgetMeConfirm !== 'FORGET ME'"
            @click="forgetMe"
          >
            {{ $t('action.delete') }}
          </MaterialButton>
          <MaterialButton @click="forgetMeDialog=false">
            {{ $t('action.cancel') }}
          </MaterialButton>
        </div>
      </Card>
    </Dialog>
  </Card>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import { useRouter } from 'vue-router'
import { useAuth, useProfile } from '@/state/authz'
import { useI18n } from 'vue-i18n'
import { useSnack } from '@/composables/useSnack'
import Card from '../layout/Card.vue'
import { getAuth } from '@firebase/auth'
import Dialog from '../material/Dialog.vue'
import TextField from '../material/TextField.vue'
import Select from '../form/Select.vue'

export default defineComponent({
  name: 'ProfileActions',
  components: {
    MaterialButton,
    Card,
    Dialog,
    TextField,
    Select
  },
  setup () {
    const i18n = useI18n()
    const router = useRouter()

    const logout = () => {
      getAuth().signOut().then(() => {
        router.push('/')
      })
    }

    function stampAllSeen () {
      const { markAllThreadsRead } = useProfile()
      markAllThreadsRead()
    }

    const langs = computed(() => {
      const l = new Map<string, string>()
      l.set('fi', i18n.t('language.fi'))
      l.set('en', i18n.t('language.en'))
      return l
    })

    const { profileMeta, switchLang } = useProfile()
    const selectedLang = ref(profileMeta.value.pelilautaLang || 'fi')
    const { pushSnack } = useSnack()

    watch(selectedLang, (currentValue) => {
      switchLang(currentValue).then(() => {
        pushSnack(i18n.t('snacks.languageUpdate') + ' ' + i18n.t('language.' + currentValue))
      })
    })

    // Forget me functionality
    const forgetMeDialog = ref(false)
    const forgetMeConfirm = ref('')

    async function forgetMe () {
      forgetMeDialog.value = false
      forgetMeConfirm.value = ''
      console.warn('Erasing the user profile from the store, and logging out the user. This can not be undone.')
      const { eraseProfile } = useAuth()
      await eraseProfile()
      pushSnack(i18n.t('profile.deleteCompleteSnackMessage'))
      router.push('/')
    }

    return { logout, stampAllSeen, langs, selectedLang, forgetMeDialog, forgetMeConfirm, forgetMe }
  }
})
</script>
