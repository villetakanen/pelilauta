<template>
  <div class="mediaTool">
    <h3>{{ $t('thread.editor.mediaTool.title') }}</h3>
    <p>{{ $t('thread.editor.mediaTool.text') }}</p>
    <div class="toolbar">
      <TextField />
      <MaterialButton>{{ $t('action.save') }}</MaterialButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MaterialButton from '../material/MaterialButton.vue'
import TextField from '../material/TextField.vue'

export default defineComponent({
  components: { TextField, MaterialButton }
})
</script>
<style lang="sass" scoped>
.mediaTool
  background-color: rgba(var(--chroma-primary-c-rgba), 0.22)
  padding: 8px
  margin-bottom: 8px
</style>
