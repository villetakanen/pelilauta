<template>
  <transition name="fade">
    <MaterialCard
      v-if="profile"
    >
      <h2>{{ $t('profile.publicInfoTitle') }}</h2>
      <p>{{ $t('profile.publicInfoHelper') }}</p>
      <div>
        <label for="nickName">Nick</label>
        <input
          id="nickName"
          v-model="v.nickname.$model"
          class="material-textfield"
          @blur="debug"
        >
        <MaterialButton
          icon
          inline
          :disabled="!v.nickname.$error && v.nickname.$dirty"
        >
          <img src="@/assets/fox.svg">
        </MaterialButton>
        <div v-if="v.nickname.$error">
          Name field has an error.
        </div>
      </div>
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

    // Nick field and persistency
    const localNick:Ref<string|null> = ref(null)
    const nickname = computed({
      get: () => (localNick.value === null ? profile.value.nick : localNick.value),
      set: (val:string) => {
        localNick.value = val
        if (!v.value.nickname.$error) console.log('can be set to:', val, v.value.nickname.$dirty)
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

.material-textfield
  margin-right: 8px
  max-width: 300px

</style>
