<template>
  <Dialog
    v-model="registrationIncomplete"
    :label="$t('registration.title')"
  >
    <div class="completeRegistrationDialog">
      <h1 class="title hideOnMobile">
        {{ $t('registration.title') }}
      </h1>
      <p>
        {{ $t('registration.info') }}
      </p>
      <div>
        <TextField
          v-model="formNickName"
          :label="$t('profile.nick')"
          :error="formNickName.length < 1"
        />
      </div>
      <div class="toolbar">
        <div class="spacer" />
        <MaterialButton
          text
          :action="logout"
        >
          {{ $t('action.logout') }}
        </MaterialButton>
        <MaterialButton
          :disabled="formNickName.length < 1"
          :async-action="save"
        >
          {{ $t('registration.createProfile') }}
        </MaterialButton>
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts">
import { useAuth } from '@/state/authz'
import { computed, defineComponent, Ref, ref } from 'vue'
import Dialog from '../material/Dialog.vue'
import MaterialButton from '../material/MaterialButton.vue'
import TextField from '../material/TextField.vue'
import { useRouter } from 'vue-router'
import { useSnack } from '@/composables/useSnack'
import { useI18n } from 'vue-i18n'
import { getAuth } from '@firebase/auth'

export default defineComponent({
  components: { Dialog, TextField, MaterialButton },
  setup () {
    const { registrationIncomplete, displayName, createProfile } = useAuth()
    const { pushSnack } = useSnack()
    const i18n = useI18n()
    const router = useRouter()

    const nickName:Ref<null|string> = ref(null)
    const formNickName = computed({
      get: () => (nickName.value !== null ? nickName.value : displayName.value),
      set: (value) => {
        nickName.value = value
      }
    })

    const logout = () => {
      getAuth().signOut().then(() => {
        router.push('/')
      })
    }

    const save = async () => {
      try {
        await createProfile(formNickName.value)
        pushSnack(i18n.t('snacks.updateSuccess'))
      } catch {
        pushSnack(i18n.t('snacks.updateFailed'))
      }
    }

    return { registrationIncomplete, formNickName, logout, save }
  }
})
</script>
