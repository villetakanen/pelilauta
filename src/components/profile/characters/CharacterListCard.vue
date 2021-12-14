<template>
  <Card class="CharacterListCard">
    <h3>
      <router-link :to="`/character/${character.id}`">
        {{ character.name }}
      </router-link>
    </h3>
    <div
      v-if="character.avatarURL"
      class="characterAvatar rise-1"
      :style="`background-image: url(${character.avatarURL})`"
    />
    <p v-if="character.site">
      <router-link :to="`/site/${site.id}`">
        {{ site.name }}
      </router-link>
    </p>
    <p v-else>
      <i>{{ $t('character.meta.noSite') }}</i>
    </p>
  </Card>
</template>

<script lang="ts">
import Card from '@/components/layout/Card.vue'
import { useCharacters } from '@/state/characters'
import { Character } from '@/state/characters/Character'
import { Site } from '@/state/store/Site'
import { useSites } from '@/state/sites'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  components: { Card },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { characters } = useCharacters()
    const { userSites } = useSites()
    const character = computed(() => characters.value.get(props.id) || new Character('...'))
    const site = computed(() => userSites.value.find((site) => site.id === character.value.site) || new Site())
    return { character, site }
  }
})
</script>

<style lang="sass" scoped>
.CharacterListCard.card+.CharacterListCard.card
  margin-top: 0
.characterAvatar
  height: 72px
  width: 72px
  border-radius: 50%
  background-size: cover

</style>
