<template>
  <div class="UserCharactersView">
    <Header>
      <ViewTitle
        icon="adventurer"
      >
        {{ $t('profile.characters.title') }}
      </ViewTitle>
      <SpacerDiv />
      <Button
        disabled
      >
        <Icon
          style="opacity: 0.22"
          name="add"
          small
        />
        {{ $t('action.add') }}
      </Button>
    </Header>
    <main class="emptyLayout">
      <CharacterListColumn />
    </main>
  </div>
</template>

<script lang="ts">
import Header from '@/components/layout/Header.vue'
import SpacerDiv from '@/components/layout/SpacerDiv.vue'
import ViewTitle from '@/components/layout/ViewTitle.vue'
import Icon from '@/components/material/Icon.vue'
import Button from '@/components/form/Button.vue'
import { defineComponent } from 'vue'
import CharacterListColumn from '@/components/profile/characters/CharacterListColumn.vue'

export default defineComponent({
  name: 'UserCharactersView',
  components: { Header, ViewTitle, SpacerDiv, Icon, Button, CharacterListColumn },
  setup () {

  }
})
</script>

<style lang="sass" scoped>
.UserCharactersView

</style>
