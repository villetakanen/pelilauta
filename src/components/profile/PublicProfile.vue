<template>
  <Column class="publicProfile">
    <h3>{{ $t('profile.publicInfoTitle') }}</h3>
    <p>{{ $t('profile.publicInfoHelper') }}</p>
    <div class="profileForm">
      <div class="avatarTool">
        <AvatarTool />
      </div>
      <div class="profileFields">
        <TextField
          v-model="v.nickname.$model"
          :label="$t('profile.nick')"
          :error="v.nickname.$error"
        />
        <TextField
          v-model="v.tagline.$model"
          :label="$t('profile.tagline')"
          :error="v.tagline.$error"
        />
        <div style="text-align: right">
          <MaterialButton
            :async-action="save"
            text
            :disabled="v.$errors.length > 0 || (!v.tagline.$dirty && !v.nickname.$dirty)"
          >
            {{ $t('action.save') }}
          </MaterialButton>
        </div>
      </div>
    </div>
  </Column>
</template>

<script lang="ts">
import { defineComponent, computed, ref, Ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import MaterialButton from '@/components/material/MaterialButton.vue'
import { useProfile } from '@/state/authz'
import { useAuthors } from '@/state/authors'
import TextField from '../material/TextField.vue'
import { useSnack } from '@/composables/useSnack'
import { useI18n } from 'vue-i18n'
import AvatarTool from './AvatarTool.vue'
import Column from '../layout/Column.vue'

export default defineComponent({
  name: 'PublicProfileInfoCard',
  components: {
    MaterialButton,
    TextField,
    AvatarTool,
    Column
  },
  setup () {
    const { profile, updateProfile } = useProfile()

    // Nick field and persistency
    const localNick:Ref<string|null> = ref(null)
    const nickname = computed({
      get: () => (localNick.value === null ? profile.value.nick : localNick.value),
      set: (val:string) => {
        localNick.value = val
      }
    })

    // Tagline field and persistency
    const localTagline:Ref<string|null> = ref(null)
    const tagline = computed({
      get: () => (localTagline.value === null ? profile.value.tagline : localTagline.value),
      set: (val:string|undefined) => {
        localTagline.value = val || ''
      }
    })

    const { authors } = useAuthors()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uniqueNick = (value:any) => (value.toLowerCase() === profile.value.nick?.toLowerCase() || !authors.value.find((target) => (target.nick?.toLowerCase() === value.toLowerCase())))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const minLength = (value:any) => (value.length > 3)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const maxLength = (value:any) => (value.length < 221)

    const rules = {
      nickname: { required, uniqueNick, minLength, maxLength },
      tagline: { maxLength, minLength }
    }
    const v = useVuelidate(rules, { nickname, tagline })
    const { pushSnack } = useSnack()
    const i18n = useI18n()
    const save = async () => {
      if (v.value.nickname.$error || v.value.tagline.$error) return
      try {
        await updateProfile({ nick: '' + nickname.value, tagline: '' + tagline.value })
        pushSnack(i18n.t('snacks.updateSuccess'))
      } catch {
        pushSnack(i18n.t('snacks.updateFailed'))
      }
    }

    return { profile, nickname, tagline, v, save }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-typography.sass

.publicProfile
  .profileForm
    display: flex
    .profileFields
      flex-grow: 1

</style>
