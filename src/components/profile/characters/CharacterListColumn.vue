<template>
  <Column class="CharacterListColumn">
    <Loader v-if="loading" />
    <template v-else>
      <CollectionEmptyPane
        v-if="!characters.size"
        icon="adventurer"
        :message="$t('profile.characters.emptyMessage')"
        :title="$t('profile.characters.emptyTitle')"
      >
        <Button
          @click="reroute('/character/add')"
        >
          <Icon
            name="add"
            small
            dark
          />
          {{ $t('action.add') }}
        </Button>
      </CollectionEmptyPane>
      <div
        v-else
        class="flexList"
      >
        <CharacterListCard
          v-for="character in characters"
          :id="character[0]"
          :key="character[0]"
        />
      </div>
    </template>
  </Column>
</template>

<script lang="ts">
import Loader from '@/components/app/Loader.vue'
import Button from '@/components/form/Button.vue'
import Column from '@/components/layout/Column.vue'
import Icon from '@/components/material/Icon.vue'
import CollectionEmptyPane from '@/components/material3/CollectionEmptyPane.vue'
import { useUxActions } from '@/composables/useUxActions'
import { useCharacters } from '@/state/characters'
import { defineComponent } from 'vue'
import CharacterListCard from './CharacterListCard.vue'

export default defineComponent({
  components: { Column, Loader, CollectionEmptyPane, Button, Icon, CharacterListCard },
  setup () {
    const { characters, loading } = useCharacters()
    const { reroute } = useUxActions()
    return { characters, loading, reroute }
  }
})
</script>
