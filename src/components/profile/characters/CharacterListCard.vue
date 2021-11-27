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
  </Card>
</template>

<script lang="ts">
import Card from '@/components/layout/Card.vue'
import { useCharacters } from '@/state/characters'
import { Character } from '@/state/characters/Character'
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
    const character = computed(() => characters.value.get(props.id) || new Character('...'))
    return { character }
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
