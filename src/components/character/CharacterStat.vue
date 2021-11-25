<template>
  <div vlass="CharacterStat">
    <template v-if="type === 'rich-text'">
      <RichTextEditor v-model:content="editableStat" />
    </template>
    <template v-else>
      {{ stat }}: {{ character.getStat(stat) }} | {{ type }}
    </template>
    <div
      v-if="showAdminTools"
      class="debug"
    >
      {{ character.getStat(stat) }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { Character } from '@/state/characters/Character'
import RichTextEditor from '../quill/RichTextEditor.vue'
import { useAuth } from '@/state/authz'

export default defineComponent({
  components: { RichTextEditor },
  props: {
    character: {
      type: Object as PropType<Character>,
      required: true
    },
    stat: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { showAdminTools } = useAuth()
    const type = computed(() => props.character.getStatType(props.stat))

    const editableStat = computed({
      get: () => props.character.getStat(props.stat),
      set: (value) => {
        props.character.setStat(props.stat, value)
      }
    })

    return {
      editableStat,
      type,
      showAdminTools
    }
  }
})
</script>

<style lang="sass" scoped>
.CharacterStat
  display: inline-block
</style>
