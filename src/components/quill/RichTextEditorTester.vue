<template>
  <section class="double">
    <h1>ReplyEditor.vue</h1>
    <p>This is a testing tool for the <span class="code">ReplyEditor.vue</span> wrapper component for Quill.js</p>
    <Button @click="editorContents = ''">
      Reset content
    </Button>
    <Toggle
      v-model="debug"
      label="log modelValue changes to console"
    />
    <p
      style="margin-top:24px"
      class="TypeCaption"
    >
      RichTextEditor.vue
    </p>
    <RichTextEditor
      v-model:content="editorContents"
      :debug="debug"
      class="editorField"
    />
    <p
      style="margin-top:24px"
      class="TypeCaption"
    >
      Rendered as innerHTML
    </p>
    <div
      class="richText editorContentsDemo"
      :innerHTML="editorContents"
    />
    <p
      style="margin-top:24px"
      class="TypeCaption"
    >
      Raw <span class="code">v-model:content</span>
    </p>
    <div
      class="richText editorContentsDemo code"
    >
      {{ editorContents }}
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Button from '../form/Button.vue'
import Toggle from '../material/Toggle.vue'
import RichTextEditor from './RichTextEditor.vue'

export default defineComponent({
  name: 'ReplyEditorRester',
  components: { Button, RichTextEditor, Toggle },
  setup () {
    const editorContents = ref('')
    const debug = ref(false)
    return { editorContents, debug }
  }
})
</script>

<style lang="sass" scoped>
.editorContentsDemo
  margin-top: 12px
  border-top: dashed 2px var(--chroma-secondary-g)
</style>
