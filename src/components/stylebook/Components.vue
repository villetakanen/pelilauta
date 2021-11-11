<template>
  <Column class="components">
    <section>
      <h1>Components</h1>
      <p>
        <Toggle
          v-model="toggleVisibility"
          label="Toggle Focus"
        />
      </p>
      <p>Material Design 3 inspired components</p>
    </section>
    <section>
      <h2>Floating Action Buttons (FAB's)</h2>
      <Fab3
        icon="add"
        label="Add new post"
      />
      <Fab3
        icon="delete"
        label="delete"
        small
      />
    </section>
  </Column>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import Column from '../layout/Column.vue'
import Toggle from '../material/Toggle.vue'
import Fab3 from '../material3/Fab3.vue'

export default defineComponent({
  name: 'StatefulComponents',
  components: { Column, Fab3, Toggle },
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    const toggleVisibility = computed({
      get: () => props.modelValue === 'InteractiveElemets',
      set: (v:boolean) => {
        if (v) context.emit('update:modelValue', 'Components')
        else context.emit('update:modelValue', '')
      }
    })
    return { toggleVisibility }
  }
})
</script>
