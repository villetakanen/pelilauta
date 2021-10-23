<template>
  <div class="characterListingView">
    <ProfileToolbar />
    <main class="singleColumnLayout">
      <div class="toolbar">
        <h1 class="title">
          {{ $t('profile.characterListing.title') }}
        </h1>
        <div class="spacer" />
        <Button @click="addNewCharacter()">
          {{ $t('action.create') }}
        </Button>
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
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ProfileToolbar from '@/components/profile/ProfileToolbar.vue'
import { useCharacters } from '@/state/characters'
import Button from '@/components/form/Button.vue'

export default defineComponent({
  name: 'ProfileView',
  components: {
    ProfileToolbar,
    Button
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
