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
          @blur="debug"
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
      <!-- label for="tagLine">Tagline</label>
      <input
        id="tagLine"
        v-model="tagline"
        class="material-textfield"
      >
      <MaterialButton :disabled="profile.nick === nickname">
        save
      </MaterialButton>
      <!- - p>{{ profile }}</p -->
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
import { useAuthors } from '@/lib/authors'

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

    const tagline = computed({
      get: () => (profile.value.tagline),
      set: (val:string) => {
        // noop
      }
    })
    const { authors } = useAuthors()
    const uniqueNick = (value:any) => (value.toLowerCase() === profile.value.nick.toLowerCase() || !authors.value.find((target) => (target.nick.toLowerCase() === value.toLowerCase())))
    const minLength = (value:any) => (value.length > 3)
    const maxLength = (value:any) => (value.length < 221)

    const rules = {
      nickname: { required, uniqueNick, minLength, maxLength },
      tagline: { maxLength }
    }
    const v = useVuelidate(rules, { nickname })
    function debug () {
      console.log(v)
    }
    return { profile, nickname, tagline, v, debug, saveNick }
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
