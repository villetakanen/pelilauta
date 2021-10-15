<template>
  <div class="mediaTool">
    <div v-if="slug">
      <iframe
        title="Youtube Preview"
        :src="`https://www.youtube.com/embed/${slug}?enablejsapi=1&origin=http://example.com`"
        frameborder="0"
      />
    </div>
    <Toolbar>
      <Textfield
        v-model="slug"
        :label="$t('threads.edit.videolink')"
      />
    </Toolbar>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import Toolbar from '../layout/Toolbar.vue'
import Textfield from '../form/Textfield.vue'

export default defineComponent({
  components: { Toolbar, Textfield },
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    const localValue = ref('')
    const slug = computed({
      get: () => (localValue.value || props.modelValue),
      set: (value) => {
        if (localValue.value !== value) {
          localValue.value = value
          context.emit('update:modelValue', value)
        }
      }
    })
    return { slug }
  }
})
</script>
<style lang="sass" scoped>
.mediaTool
  background-color: var(--chroma-secondary-d)
  padding: 8px
  margin-bottom: 8px
</style>
