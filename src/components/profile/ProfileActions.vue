<template>
  <Column class="profileActions">
    <h1 class="title">
      {{ $t('profile.actions.title') }}
    </h1>
    <p>{{ $t('profile.actions.helper') }}</p>

    <p>
      <Select
        v-model="selectedLang"
        name="selectLanguage"
        :label="$t('profile.actions.selectLang')"
        :opts="langs"
      />
    </p>

    <p>
      <Toggle
        v-model="showExperimentalTools"
        :label="$t('profile.actions.useExperimental')"
      />
    </p>

    <div>
      <h1 class="title">
        {{ $t('profile.actions.actions') }}
      </h1>
      <Button
        text
        @click="stampAllSeen"
      >
        {{ $t('action.markAllRead') }}
      </Button>
      <br>

      <Button
        text
        @click="forgetMeDialog = true"
      >
        {{ $t('action.forgetMe') }}
      </Button>
      <br>

      <div class="spacer" />
      <Button
        text
        @click="logout"
      >
        {{ $t('action.logout') }}
      </Button>
    </div>
    <Dialog v-model="forgetMeDialog">
      <div>
        <h3>{{ $t('action.delete') }}</h3>
        <p>{{ $t('profile.deleteWarning') }}</p>
        <TextField
          id="pageEditorDeleteVerifyField"
          v-model="forgetMeConfirm"
        />
        <div class="toolbar">
          <div class="spacer" />
          <Button
            id="pageEditorDeleteVerifyButton"
            :disabled="forgetMeConfirm !== 'FORGET ME'"
            @click="forgetMe"
          >
            {{ $t('action.delete') }}
          </Button>
          <Button @click="forgetMeDialog=false">
            {{ $t('action.cancel') }}
          </Button>
        </div>
      </div>
    </Dialog>
  </Column>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth, useProfile } from '@/state/authz'
import { useI18n } from 'vue-i18n'
import { useSnack } from '@/composables/useSnack'
import Column from '../layout/Column.vue'
import { getAuth } from '@firebase/auth'
import Dialog from '../material/Dialog.vue'
import TextField from '../material/TextField.vue'
import Select from '../form/Select.vue'
import Toggle from '../material/Toggle.vue'
import Button from '../form/Button.vue'
export default defineComponent({
  name: 'ProfileActions',
  components: {
    Column,
    Dialog,
    TextField,
    Select,
    Toggle,
    Button
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
    const { showExperimentalTools } = useAuth()
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
    return { logout, stampAllSeen, langs, selectedLang, forgetMeDialog, forgetMeConfirm, forgetMe, showExperimentalTools }
  }
})
</script>
