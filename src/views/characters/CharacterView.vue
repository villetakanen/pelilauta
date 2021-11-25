<template>
  <div class="characterListingView">
    <Header>
      <ViewTitle icon="adventurer">
        {{ character.name }}
      </ViewTitle>
      <SpacerDiv />
      <MaterialMenu v-model="menu" />
    </Header>
    <main class="bookLayout">
      <CharacterSheet
        :id="id"
        class="double"
      />
    </main>
    <Dialog
      v-model="showDeleteDialog"
      :label="$t('character.delete.title')"
    >
      <p>{{ $t('character.delete.warning') }}</p>
      <Toggle
        v-model="deleteConfirm"
        :label="$t('action.deleteConfirm')"
      />
      <template #footer>
        <Toolbar>
          <SpacerDiv />
          <Button
            text
            @click="showDeleteDialog = false"
          >
            {{ $t('action.cancel') }}
          </Button>
          <Button
            :disabled="!deleteConfirm"
            @click="drop"
          >
            {{ $t('action.delete') }}
          </Button>
        </Toolbar>
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, watch, ref } from 'vue'
import { useCharacters } from '@/state/characters'
import { useSite } from '@/state/site'
import { Character } from '@/state/characters/Character'
import CharacterSheet from '@/components/character/CharacterSheet.vue'
import Header from '@/components/layout/Header.vue'
import ViewTitle from '@/components/layout/ViewTitle.vue'
import SpacerDiv from '@/components/layout/SpacerDiv.vue'
import MaterialMenu from '@/components/material/MaterialMenu.vue'
import { MenuItem } from '@/utils/uiInterfaces'
import { useI18n } from 'vue-i18n'
import Dialog from '@/components/material/Dialog.vue'
import Toggle from '@/components/material/Toggle.vue'
import Button from '@/components/form/Button.vue'
import Toolbar from '@/components/layout/Toolbar.vue'
import { useUxActions } from '@/composables/useUxActions'

export default defineComponent({
  name: 'CharacterView',
  components: { CharacterSheet, ViewTitle, Header, SpacerDiv, MaterialMenu, Dialog, Toggle, Button, Toolbar },
  props: {
    id: {
      type: String,
      required: false,
      default: '-'
    }
  },
  setup (props) {
    const i18n = useI18n()
    const { characters, deleteCharacter } = useCharacters()
    const deleteConfirm = ref(false)
    const showDeleteDialog = ref(false)
    const { reroute } = useUxActions()

    const character = computed(() => {
      return characters.value.get(props.id) || new Character('...')
    })

    onMounted(() => {
      watch(character, (char) => {
        if (char.site) {
          useSite(char.site)
        }
      },
      { immediate: true })
    })

    const menu = computed(():MenuItem[] => {
      const items:MenuItem[] = []
      items.push({
        icon: 'delete',
        text: i18n.t('action.delete'),
        action: () => {
          showDeleteDialog.value = true
        }
      })
      return items
    })

    async function drop () {
      if (!deleteConfirm.value) {
        return
      }
      await deleteCharacter(props.id)
      reroute('/profile/characters')
    }

    return { character, menu, deleteConfirm, showDeleteDialog, drop }
  }
})
</script>
