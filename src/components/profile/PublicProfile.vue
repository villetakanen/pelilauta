<template>
  <Column class="publicProfile">
    <h3>{{ $t('profile.publicInfoTitle') }}</h3>
    <p>{{ $t('profile.publicInfoHelper') }}</p>
    <div class="profileForm">
      <div class="avatarTool">
        <AvatarSelector v-model="photoURL" />
      </div>
      <div class="profileFields">
        <Textfield
          v-model="v.nickname.$model"
          :label="$t('profile.nick')"
          :error="v.nickname.$error"
        />
        <Textfield
          v-model="v.tagline.$model"
          :label="$t('profile.tagline')"
          :error="v.tagline.$error"
        />
        <div style="text-align: right">
          <Button
            :disabled="(v.$errors.length > 0 || (!v.tagline.$dirty && !v.nickname.$dirty)) && profileData.photoURL === photoURL"
            @click="save"
          >
            {{ $t('action.save') }}
          </Button>
        </div>
      </div>
    </div>
  </Column>
</template>

<script lang="ts">
import { defineComponent, computed, ref, Ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useAuth } from '@/state/authz'
import { useAuthors } from '@/state/authors'
import Textfield from '../form/Textfield.vue'
import { useSnack } from '@/composables/useSnack'
import { useI18n } from 'vue-i18n'
import Column from '../layout/Column.vue'
import AvatarSelector from '../avatar/AvatarSelector.vue'
import Button from '../form/Button.vue'
import { logError } from '@/utils/eventLogger'

export default defineComponent({
  name: 'PublicProfileInfoCard',
  components: {
    Textfield,
    Column,
    AvatarSelector,
    Button
  },
  setup () {
    const { profileData, updateProfileData } = useAuth()

    // Nick field and persistency
    const localNick = ref('')
    const nickname = computed({
      get: () => (!localNick.value ? profileData.value.nick : localNick.value),
      set: (val:string) => {
        localNick.value = val
      }
    })

    // Tagline field and persistency
    const localTagline:Ref<string> = ref('')
    const tagline = computed({
      get: () => (!localTagline.value ? profileData.value.tagline : localTagline.value),
      set: (val:string|undefined) => {
        localTagline.value = val || ''
      }
    })

    const { authors } = useAuthors()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uniqueNick = (value:any) => (value.toLowerCase() === profileData.value.nick?.toLowerCase() || !authors.value.find((target) => (target.nick?.toLowerCase() === value.toLowerCase())))
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
        await updateProfileData({ nick: nickname.value, tagline: tagline.value, photoURL: photoURL.value })
        pushSnack(i18n.t('snacks.updateSuccess'))
      } catch (e) {
        logError(e)
        pushSnack(i18n.t('snacks.updateFailed'))
      }
    }

    // Tagline field and persistency
    const localPhotoURL:Ref<string> = ref('')
    const photoURL = computed({
      get: () => (!localPhotoURL.value ? profileData.value.photoURL : localPhotoURL.value),
      set: (val:string|undefined) => {
        localPhotoURL.value = val || ''
      }
    })

    return { nickname, tagline, v, save, photoURL, profileData }
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
