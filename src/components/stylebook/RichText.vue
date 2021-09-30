<template>
  <Column class="textStyles">
    <h1>Ritch Text Editor</h1>
    <p>We use the @next npm build of Quill.js, with custom parchment, as the ritch text editor.</p>
    <p>At 10.0.0 the content of the editor is saved as HTML, but saving the Delta might make more sense in the future.</p>
    <h2>Demo of the Editor</h2>
    <Button @click="mode='editor'">
      Editor
    </Button>
    <Button @click="mode='html'">
      HTML
    </Button>
    <Button @click="mode='delta'">
      Delta
    </Button>
    <Button secondary>
      Reset
    </Button>
    <hr>
    <RichTextEditor
      v-if="mode === 'editor'"
      v-model:content="innerHTML"
      @delta="setDelta($event)"
    />
    <div
      v-if="mode === 'html'"
      :innerHTML="innerHTML"
    />
    <div v-if="mode === 'delta'">
      {{ delta }}
    </div>

    <RitchTextView :delta-content="deltaOps" />
  </Column>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Button from '../form/Button.vue'
import Column from '../layout/Column.vue'
import RichTextEditor from '../quill/RichTextEditor.vue'
import Delta from 'quill-delta'
import RitchTextView from '../quill/RichTextView.vue'
import { DeltaOperation } from '@/utils/contentFormat'

export default defineComponent({
  name: 'TextStyles',
  components: { Column, RichTextEditor, Button, RitchTextView },
  setup () {
    const mode = ref('editor')
    const innerHTML = ref('<p>...</p>')
    const delta = ref('')
    const deltaOps = ref(new Array<DeltaOperation>())
    function setDelta (val:unknown) {
      const d = (val as Delta).ops
      delta.value = d.map((v) => (JSON.stringify(v))).join()
      deltaOps.value = d
    }
    return { mode, innerHTML, setDelta, delta, deltaOps }
  }
})
</script>
