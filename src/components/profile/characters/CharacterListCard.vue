<template>
  <Card class="CharacterListCard">
    <h3>
      <router-link :to="`/character/${character.id}`">
        {{ character.name }}
      </router-link>
    </h3>
    <Toolbar>
      <Button text>
        {{ $t('character.title') }}
      </Button>
    </Toolbar>
  </Card>
</template>

<script lang="ts">
import Button from '@/components/form/Button.vue'
import Card from '@/components/layout/Card.vue'
import Toolbar from '@/components/layout/Toolbar.vue'
import { useCharacters } from '@/state/characters'
import { Character } from '@/state/characters/Character'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  components: { Card, Toolbar, Button },
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
</style>
