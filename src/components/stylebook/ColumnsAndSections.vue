<template>
  <Column class="columnsAndSections double-cut">
    <section>
      <h1>Columns and Sections</h1>
      <p>
        All content within a view layout should exist inside a <span class="code">Column</span>, and a <span class="code">section</span>.
        These tags act as syntactic sugar for the layout templates.
      </p>
    </section>
    <Card>
      <h2>Cards</h2>
      <p>
        A <span class="code">Card</span>is a <span class="code">section</span> with some presets for styling within a column.
        The style classes for text, images etc. can be found from <span class="code">@/styles/layout.sass</span>.
      </p>
      <p>The <span class="code">Card</span> always takes all the available space inside a column.</p>
    </Card>
  </Column>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Card from '../layout/Card.vue'
import Column from '../layout/Column.vue'

export default defineComponent({
  name: 'TextStyles',
  components: { Column, Card }
})
</script>
