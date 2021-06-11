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
        />
      </div>
      <div class="toolbar">
        <div class="spacer" />
        <MaterialButton text>
          {{ $t('action.logout') }}
        </MaterialButton>
        <MaterialButton>{{ $t('registration.createProfile') }}</MaterialButton>
      </div>
    </Card>
  </Dialog>
</template>

<script lang="ts">
import { useAuth } from '@/state/authz'
import { computed, defineComponent, ref } from 'vue'
import Card from '../layout/Card.vue'
import Dialog from '../material/Dialog.vue'
import MaterialButton from '../material/MaterialButton.vue'
import TextField from '../material/TextField.vue'

export default defineComponent({
  components: { Dialog, Card, TextField, MaterialButton },
  setup () {
    const { registrationIncomplete, displayName } = useAuth()
    const nickName = ref('')
    const formNickName = computed({
      get: () => (nickName.value || displayName.value),
      set: (value) => {
        nickName.value = value
      }
    })
    return { registrationIncomplete, formNickName }
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
