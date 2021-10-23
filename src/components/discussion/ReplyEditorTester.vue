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
      ReplyEditor.vue
    </p>
    <ReplyEditor
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
import ReplyEditor from './ReplyEditor.vue'

export default defineComponent({
  name: 'ReplyEditorRester',
  components: { Button, ReplyEditor, Toggle },
  setup () {
    const editorContents = ref('')
    const debug = ref(false)
    return { editorContents, debug }
  }
})
</script>

<style lang="sass" scoped>
.editorField
  position: relative
  margin: 0px
  margin-left: 12px
  padding: 8px
  border-radius: 6px
  background-color: var(--chroma-secondary-i)
  border: solid 1px var(--chroma-secondary-g)
.editorField:after
  content: ""
  position: absolute
  border-style: solid
  border-color: transparent var(--chroma-secondary-g)
  top: 6px // controls vertical position
  left: -12px // value = - border-left-width - border-right-width */
  border-width: 0px 12px 12px 0px
  bottom: auto
.editorContentsDemo
  margin-top: 12px
  border-top: dashed 2px var(--chroma-secondary-g)
</style>
