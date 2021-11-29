<template>
  <div class="CharacterList">
    <section class="listOfCharacters">
      <template
        v-for="character in characters"
        :key="character[0]"
      >
        <div> {{ character[1].name }}</div>
        <div> <AuthorTag :uid="character[1].player" /></div>
        <div>
          <template
            v-for="stat in toggled"
            :key="stat"
          >
            <div>
              <span>{{ stat }}</span>&nbsp;
              <span>{{ character[1].getStat(stat) }}</span>
            </div>
          </template>
        </div>
      </template>
    </section>
    <hr>
    {{ toggled }}
    <section class="stats">
      <template
        v-for="stat in stats"
        :key="stat"
      >
        <Toggle
          :label="stat"
          @click.prevent="toggle(stat)"
        />
      </template>
    </section>
  </div>
</template>

<script lang="ts">
import { useSiteCharacters } from '@/state/site'
import { logDebug } from '@/utils/eventLogger'
import { computed, defineComponent, ref } from 'vue'
import AuthorTag from '../author/AuthorTag.vue'
import Toggle from '../material/Toggle.vue'

export default defineComponent({
  components: { AuthorTag, Toggle },
  setup () {
    const { characters } = useSiteCharacters()
    logDebug('CharacterList.vue', 'setup', 'siteCharacters', characters)

    const stats = computed(() => {
      if (characters.value.size > 0) {
        const [first] = characters.value.values()
        logDebug('CharacterList.vue', 'setup', 'first', first)
        return Array.from(first.stats.keys())
      }
      return []
    })

    const toggled = ref(new Array<string>())

    const toggle = (stat: string) => {
      if (toggled.value.includes(stat)) {
        toggled.value = toggled.value.filter(s => s !== stat)
      } else {
        toggled.value.push(stat)
      }
      logDebug('CharacterList.vue', 'toggle', 'stat', stat, toggled.value)
    }

    return { characters, stats, toggle, toggled }
  }
})
</script>

<style lang="sass" scoped>
.listOfCharacters
  display: grid
  grid-template-columns: 1fr 1fr 2fr
  gap: 12px
</style>
