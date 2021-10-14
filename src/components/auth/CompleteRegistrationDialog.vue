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
        <Textfield
          v-model="formNickName"
          :label="$t('profile.nick')"
          :error="formNickName.length < 1"
        />
      </div>
      <div class="toolbar">
        <div class="spacer" />
        <Button
          text
          @click="logout()"
        >
          {{ $t('action.logout') }}
        </Button>
        <Button
          :disabled="formNickName.length < 1"
          :working="working"
          @click="save()"
        >
          {{ $t('registration.createProfile') }}
        </Button>
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts">
import { useAuth } from '@/state/authz'
import { computed, defineComponent, Ref, ref } from 'vue'
import Dialog from '../material/Dialog.vue'
import { useRouter } from 'vue-router'
import { useSnack } from '@/composables/useSnack'
import { useI18n } from 'vue-i18n'
import { getAuth } from '@firebase/auth'
import Textfield from '../form/Textfield.vue'
import Button from '../form/Button.vue'

export default defineComponent({
  components: { Dialog, Textfield, Button },
  setup () {
    const { registrationIncomplete, displayName, createProfile } = useAuth()
    const { pushSnack } = useSnack()
    const i18n = useI18n()
    const router = useRouter()

    const working = ref(false)

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
      working.value = true
      try {
        await createProfile(formNickName.value)
        pushSnack(i18n.t('snacks.updateSuccess'))
      } catch {
        pushSnack(i18n.t('snacks.updateFailed'))
      }
      working.value = false
    }

    return { registrationIncomplete, formNickName, logout, save, working }
  }
})
</script>
