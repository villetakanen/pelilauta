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
      <Toggle
        v-model="vertical"
        label="Vertical on desktop"
      />
      <FabTray :vertical="vertical">
        <Fab3
          icon="plus"
          label="Add new post"
        />
        <Fab3
          icon="addDiscussion"
          label="Discuss"
          small
        />
        <Fab3
          icon="books"
          secondary
          small
        />
        <Fab3
          icon="keeper"
          tertiary
          small
        />
        <Fab3
          icon="about"
          secondary
        />
      </FabTray>
    </section>
  </Column>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import Column from '../layout/Column.vue'
import Toggle from '../material/Toggle.vue'
import Fab3 from '../material3/Fab3.vue'
import FabTray from '../material3/FabTray.vue'

export default defineComponent({
  name: 'StatefulComponents',
  components: { Column, Fab3, Toggle, FabTray },
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    const vertical = ref(false)
    const toggleVisibility = computed({
      get: () => props.modelValue === 'InteractiveElemets',
      set: (v:boolean) => {
        if (v) context.emit('update:modelValue', 'Components')
        else context.emit('update:modelValue', '')
      }
    })
    return { toggleVisibility, vertical }
  }
})
</script>
