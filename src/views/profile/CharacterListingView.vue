<template>
  <div class="characterListingView">
    <ProfileToolbar />
    <div class="singleColumnLayout">
      <h1 class="title">
        {{ $t('profile.characterListing.title') }}
      </h1>
      <div class="characterListing">
        <div
          v-for="pc in playerCharacters"
          :key="pc[0]"
        >
          <h4>{{ pc[1].name }}</h4>
        </div>
      </div>
      <div class="debug">
        {{ playerCharacters }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ProfileToolbar from '@/components/profile/ProfileToolbar.vue'
import { useCharacters } from '@/state/characters'

export default defineComponent({
  name: 'ProfileView',
  components: {
    ProfileToolbar
  },
  setup () {
    const { playerCharacters } = useCharacters()
    return { playerCharacters }
  }
})
</script>

<style lang="sass" scoped>
.debug
  font-size: 10px
  font-family: monospace
  line-height: 12px
  color: green
  border: solid 1px green
  padding:8px
  margin-top:8px
</style>
