<template>
  <Column class="textStyles">
    <h1>Stylebook</h1>
    <p>
      This page acts as a kind of a Diary for the UX and UI design for the app. Additionally, it is a
      very convinient way to test and document usage of UX/UI practices, tooling, components, and
      styles in the codebase.
    </p>
    <h2>Router View style classes</h2>
    <p>Found in <span class="code">@/styles/views.sass</span></p>
    <div class="grid-of-2">
      <p>
        By using the <span class="code">&lt;@/components/form/Select.vue&gt;</span> component in the right,
        you can switch between the different layout models we have for the router-views.
      </p>
      <div>
        <Select
          v-model="selectedLayout"
          name="LayoutSelector"
          :opts="layouts"
          label="Select a layoyt"
        />
      </div>
    </div>
  </Column>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import Select from '@/components/form/Select.vue'
import Column from '@/components/layout/Column.vue'

export default defineComponent({
  name: 'StyleBookIntro',
  components: { Column, Select },
  props: {
    modelValue: { type: String, required: true }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    const selectedLayout = ref(props.modelValue)
    watch(selectedLayout, (v) => {
      context.emit('update:modelValue', v)
    })
    const layouts = new Map<string, string>()
    layouts.set('emptyLayout', 'emptyLayout')
    layouts.set('singleColumnLayout', 'singleColumnLayout')
    layouts.set('dashBoardLayout', 'dashBoardLayout')
    layouts.set('flexLayout', 'flexLayout')
    return { selectedLayout, layouts }
  }
})
</script>
