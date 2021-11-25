<template>
  <Column class="statefulcomponents">
    <section>
      <h1>Some stateful components</h1>
      <Toggle
        v-model="toggleVisibility"
        label="Toggle Focus"
      />
      <p>Some of the vue components (with state) are used across the app. Most significant should be documented here for ease of use.</p>
    </section>
    <section>
      <h2>Language Switcher</h2>
      <p>The language switcher is a bit special component, as it works differently depending if a user is anonymous or logged in.</p>
      <p><LocaleSwitcher /> Locale is {{ locale }}</p>
    </section>
    <section>
      <h2>Author links</h2>
      <p><AuthorTag uid="4fN0HG08edQ1Bi3t3zHyXllCPnz2" /></p>
    </section>
  </Column>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import LocaleSwitcher from '../app/LocaleSwitcher.vue'
import AuthorTag from '../author/AuthorTag.vue'
import Column from '../layout/Column.vue'
import Toggle from '../material/Toggle.vue'

export default defineComponent({
  name: 'StatefulComponents',
  components: { Column, AuthorTag, Toggle, LocaleSwitcher },
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    const toggleVisibility = computed({
      get: () => props.modelValue === 'StatefulComponents',
      set: (v:boolean) => {
        if (v) context.emit('update:modelValue', 'StatefulComponents')
        else context.emit('update:modelValue', '')
      }
    })
    const i18n = useI18n()
    const locale = computed(() => i18n.locale.value)
    return {
      locale,
      toggleVisibility
    }
  }
})
</script>
