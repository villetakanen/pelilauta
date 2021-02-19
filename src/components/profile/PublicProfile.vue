<template>
  <transition name="fade">
    <MaterialCard
      v-if="profile"
    >
      <h2>{{ $t('profile.publicInfoTitle') }}</h2>
      <p>{{ $t('profile.publicInfoHelper') }}</p>
      <div class="materialField">
        <label for="nickName">Nick</label>
        <input
          id="nickName"
          v-model="v.nickname.$model"
          class="material-textfield"
          :class="{ error: v.nickname.$error }"
        >
        <MaterialButton
          icon
          inline
          :disabled="v.nickname.$error || !v.nickname.$dirty"
          :action="saveNick"
        >
          <img src="@/assets/icons/save.svg">
        </MaterialButton>
      </div>
      <div class="materialField">
        <label for="tagline">{{ $t('profile.tagline') }}</label>
        <input
          id="tagline"
          v-model="v.tagline.$model"
          class="material-textfield"
        >
        <MaterialButton
          icon
          inline
          :disabled="v.tagline.$error || !v.tagline.$dirty"
          :action="saveTagline"
        >
          <img src="@/assets/icons/save.svg">
        </MaterialButton>
      </div>
    </MaterialCard>
  </transition>
</template>

<script lang="ts">
import { defineComponent, computed, ref, Ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import MaterialCard from '@/components/material/MaterialCard.vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import { useProfile } from '@/state/authz'
import { useAuthors } from '@/state/authors'

export default defineComponent({
  name: 'PublicProfileInfoCard',
  components: {
    MaterialCard,
    MaterialButton
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
    const saveNick = () => {
      if (!v.value.nickname.$error &&
        typeof localNick.value === 'string') updateProfile({ nick: localNick.value })
    }

    // Tagline field and persistency
    const localTagline:Ref<string|null> = ref(null)
    const tagline = computed({
      get: () => (localTagline.value === null ? profile.value.tagline : localTagline.value),
      set: (val:string|undefined) => {
        localTagline.value = val || ''
      }
    })
    const saveTagline = () => {
      if (!v.value.tagline.$error &&
        typeof localTagline.value === 'string') updateProfile({ tagline: localTagline.value })
    }

    const { authors } = useAuthors()
    const uniqueNick = (value:any) => (value.toLowerCase() === profile.value.nick?.toLowerCase() || !authors.value.find((target) => (target.nick?.toLowerCase() === value.toLowerCase())))
    const minLength = (value:any) => (value.length > 3)
    const maxLength = (value:any) => (value.length < 221)

    const rules = {
      nickname: { required, uniqueNick, minLength, maxLength },
      tagline: { maxLength, minLength }
    }
    const v = useVuelidate(rules, { nickname, tagline })

    return { profile, nickname, tagline, v, saveNick, saveTagline }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.materialField
  height: 56px
  box-sizing: border-box
  padding: 8px 0
  display: block
  position: relative
  // border: solid 1px red
  label
    position: absolute
    top: 0px
    left: 4px
    @include TypeCaption()
  label+input
    margin-top: 10px
.material-textfield
  margin-right: 8px
  max-width: 300px

</style>
