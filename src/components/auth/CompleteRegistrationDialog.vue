<template>
  <Dialog v-model="registrationIncomplete">
    <Card class="dialogCard">
      <h1 class="title">
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
    </Card>
  </Dialog>
</template>

<script lang="ts">
import { useAuth, useProfile } from '@/state/authz'
import { computed, defineComponent, Ref, ref } from 'vue'
import Card from '../layout/Card.vue'
import Dialog from '../material/Dialog.vue'
import MaterialButton from '../material/MaterialButton.vue'
import TextField from '../material/TextField.vue'
import firebase from 'firebase/app'
import 'firebase/auth'
import { useRouter } from 'vue-router'
import { useSnack } from '@/composables/useSnack'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  components: { Dialog, Card, TextField, MaterialButton },
  setup () {
    const { registrationIncomplete, displayName } = useAuth()
    const { updateProfile } = useProfile()
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
      firebase.auth().signOut().then(() => {
        router.push('/')
      })
    }

    const save = async () => {
      try {
        await updateProfile({ nick: '' + nickName.value })
        pushSnack(i18n.t('snacks.updateSuccess'))
      } catch {
        pushSnack(i18n.t('snacks.updateFailed'))
      }
    }

    return { registrationIncomplete, formNickName, logout, save }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss

@include media('<tablet')
  .dialogCard
    max-width: calc(100vw - 64px)
    width: calc(100vw - 64px)
</style>
