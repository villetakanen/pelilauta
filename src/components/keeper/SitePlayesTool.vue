<template>
  <Column class="SitePlayersTool">
    <h1 class="title">
      {{ $t('keeper.sitePlayersTool.title') }}
    </h1>
    <p
      class="TypeCaption"
      style="font-style: italic; padding-bottom: 12px"
    >
      {{ $t('keeper.sitePlayersTool.description') }}
    </p>
    <hr>
    <div
      v-for="player in site.players"
      :key="player"
    >
      <AuthorTag :uid="player" />
      <Button
        :disabled="!showSiteAdminTools"
        text
        @click="removePlayer(player)"
      >
        {{ $t('action.delete') }}
      </Button>
    </div>
    <hr>
    <div class="addPlayer">
      <Select
        v-model="newPlayerId"
        name="playerSelector"
        :disabled="!showSiteAdminTools"
        :opts="available"
        :label="$t('keeper.sitePlayersTool.addPlayer')"
      />
      <Button
        :disabled="!showSiteAdminTools"
        secondary
        @click="add()"
      >
        {{ $t('action.add') }}
      </Button>
    </div>
  </Column>
</template>

<script lang="ts">
import { useAuthors } from '@/state/authors'
import { useSite } from '@/state/site'
import { computed, defineComponent, onMounted, ref } from 'vue'
import AuthorTag from '../author/AuthorTag.vue'
import Button from '../form/Button.vue'
import Select from '../form/Select.vue'
import Column from '../layout/Column.vue'

export default defineComponent({
  components: { Column, AuthorTag, Button, Select },
  setup () {
    const newPlayerId = ref('')
    const { site, showSiteAdminTools, addPlayer, removePlayer } = useSite()
    const { subscribeToAuthors, nonFrozenAuthors } = useAuthors()
    onMounted(() => subscribeToAuthors())
    const available = computed(() => {
      if (!site.value.players) return new Map()
      return new Map(nonFrozenAuthors.value.filter(author => {
        if (!site.value.players) return false
        return !site.value.players.includes(author.uid)
      }).map(author => {
        return [author.uid, author.nick]
      }))
    })

    function add () {
      addPlayer(newPlayerId.value)
    }

    return { site, showSiteAdminTools, available, newPlayerId, add, removePlayer }
  }
})
</script>

<style lang="sass" scoped>
.addPlayer
  display: flex
  justify-content: space-between

</style>
