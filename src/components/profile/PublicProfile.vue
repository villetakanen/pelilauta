<template>
  <transition name="fade">
    <MaterialCard
      v-if="profile"
    >
      <h2>{{ $t('profile.publicInfoTitle') }}</h2>
      <p>{{ $t('profile.publicInfoHelper') }}</p>
      <label for="nickName">Nick</label>
      <input id="nickName" class="material-textfield" v-model="nickName">
      <MaterialButton :disabled="profile.nick === nickName"> save</MaterialButton>
      <p>{{ profile }}</p>
    </MaterialCard>
  </transition>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
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
    const nickName = computed({
      get: () => (profile.value.nick),
      set: (val:string) => {
        // noop
      }
    })
    return { profile, nickName }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

</style>
