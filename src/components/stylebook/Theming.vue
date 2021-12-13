<template>
  <Column
    class="Theming double themeable"
    :class="{
      themeDD: theme === 'dd',
      quick: theme === 'quick',
    }"
  >
    <section>
      <h1>Theming</h1>
      <p>The contents of this column are styled with the theme vaeriables.</p>
      <Select
        v-model="theme"
        name="theme"
        :opts="themes"
        :label="'Theme'"
        :placeholder="'Select a theme'"
      />
    </section>
    <section>
      <h2>Example components</h2>
      <Card>
        <h1>A Card</h1>
        <p>With some text!</p>
        <template #bottom>
          <Icon
            name="adventurer"
            small
          />
          <SpacerDiv />
          <p class="TypeCaption">
            And a caption tailer
          </p>
        </template>
      </Card>
    </section>
  </Column>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Select from '../form/Select.vue'
import Card from '../layout/Card.vue'
import Column from '../layout/Column.vue'
import SpacerDiv from '../layout/SpacerDiv.vue'
import Icon from '../material/Icon.vue'

export default defineComponent({
  components: { Select, Column, Card, Icon, SpacerDiv },
  setup () {
    const theme = ref('dd')
    const themes = ref([
      ['default', 'Default'],
      ['dd', 'D&D'],
      ['quick', 'The Quick']
    ])
    return { themes, theme }
  }
})
</script>
