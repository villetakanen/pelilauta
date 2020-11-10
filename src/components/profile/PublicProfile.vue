<template>
  <transition name="fade">
    <MaterialCard
      v-if="profile"
    >
      <h2>{{ $t('profile.publicInfoTitle') }}</h2>
      <p>{{ $t('profile.publicInfoHelper') }}</p>
      <label for="nickName">Nick</label>
      <input
        id="nickName"
        v-model="v.nickname.$model"
        class="material-textfield"
        @blur="debug"
      >
      <div v-if="v.nickname.$error">Name field has an error.</div>
      <label for="tagLine">Tagline</label>
      <input
        id="tagLine"
        v-model="tagline"
        class="material-textfield"
      >
      <MaterialButton :disabled="profile.nick === nickname">
        save
      </MaterialButton>
      <!-- p>{{ profile }}</p -->
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

export default defineComponent({
  name: 'PublicProfileInfoCard',
  components: {
    MaterialCard,
    MaterialButton
  },
  setup () {
    const { profile } = useProfile()
    const localNick:Ref<string|null> = ref(null)
    const nickname = computed({
      get: () => (localNick.value === null ? profile.value.nick : localNick.value),
      set: (val:string) => {
        console.log('set to:', val)
        localNick.value = val
      }
    })
    const tagline = computed({
      get: () => (profile.value.tagline),
      set: (val:string) => {
        // noop
      }
    })
    const rules = {
      nickname: { required }
    }
    const v = useVuelidate(rules, { nickname })
    function debug () {
      console.log(v)
    }
    return { profile, nickname, tagline, v, debug }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

</style>
