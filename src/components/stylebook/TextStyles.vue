<template>
  <Column class="textStyles">
    <h1>Typography: font and color style</h1>
    <h2>Paragraphs</h2>
    <p>
      <Toggle
        v-model="bodyTextSmall"
        label="Apply class TypeBody2 to the paragraphs below"
      />
    </p>
    <p :class="{ TypeBody2: bodyTextSmall }">
      We support three text colors for body text. Here is a paragraph with no color styling for High Emphasis. It can also be
      "turned on" for other tags by using the class <span class="code">highEmphasis</span> or a mixin <span class="code">@highEmphasis</span>
    </p>
    <p
      class="mediumEmphasis"
      :class="{ TypeBody2: bodyTextSmall }"
    >
      Using the class <span class="code">mediumEmphasis</span> or a mixin <span class="code">@mediumEmphasis</span>
      from <span class="code">@import @/styles/atomics.sass</span> will tone down the text.
    </p>
    <p
      class="lowEmphasis"
      :class="{ TypeBody2: bodyTextSmall }"
    >
      In a similar fashion, the class <span class="code">lowEmphasis</span> or a mixin <span class="code">@lowEmphasis</span>
      from <span class="code">@import @/styles/atomics.sass</span> will tone down the text.
    </p>
  </Column>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Column from '../layout/Column.vue'
import Toggle from '../material/Toggle.vue'

export default defineComponent({
  name: 'TextStyles',
  components: { Column, Toggle },
  setup () {
    const bodyTextSmall = ref(false)
    return { bodyTextSmall }
  }
})
</script>
