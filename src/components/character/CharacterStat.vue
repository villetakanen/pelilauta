<template>
  <div class="CharacterStat">
    <template v-if="type === 'string'">
      <RichTextEditor v-model:content="editableStat" />
    </template>
    <template v-if="type === 'number'">
      <div class="rating">
        <div class="TypeCaption label">
          {{ stat }}
        </div>
        <div class="value">
          {{ editableStat }}
        </div>
      </div>
    </template>
    <template v-else>
      {{ stat }}: {{ editableStat }} | {{ type }}
    </template>
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
    const type = computed(() => props.character.getStat(props.stat)?.type || 'number')

    const editableStat = computed({
      get: () => props.character.getStat(props.stat)?.value,
      set: (value) => {
        props.character.setStat(props.stat, value || 0)
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
  margin-bottom: 12px
  .rating
    display: flex
    flex-direction: column
    align-items: center
    gap: 4px
  .label
    font-weight: bold
  .value
    height: 48px
    width: 48px
    background-color: var(--chroma-secondary-d)
    text-align: center
    line-height: 48px
    color: var(--chroma-secondary-i)
    font-size: 24px
    border-radius: 50%
</style>
