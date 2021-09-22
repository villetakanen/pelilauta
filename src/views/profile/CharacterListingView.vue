<template>
  <div class="characterListingView">
    <ProfileToolbar />
    <div class="singleColumnLayout">
      <div class="toolbar">
        <h1 class="title">
          {{ $t('profile.characterListing.title') }}
        </h1>
        <div class="spacer" />
        <MaterialButton :async-action="addNewCharacter">
          {{ $t('action.create') }}
        </MaterialButton>
      </div>
      <div class="characterListing">
        <div
          v-for="pc in playerCharacters"
          :key="pc[0]"
        >
          <h4>
            <router-link :to="`/character/${pc[0]}`">
              {{ pc[1].name }}
            </router-link>
          </h4>
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
import MaterialButton from '@/components/material/MaterialButton.vue'

export default defineComponent({
  name: 'ProfileView',
  components: {
    ProfileToolbar,
    MaterialButton
  },
  setup () {
    const { playerCharacters, createNewPlayerCharacter } = useCharacters()

    async function addNewCharacter () {
      return createNewPlayerCharacter({ name: 'N.N.' })
    }

    return { playerCharacters, addNewCharacter }
  }
})
</script>
