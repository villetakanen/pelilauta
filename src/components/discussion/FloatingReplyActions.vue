<template>
  <div class="floatingReplyActions">
    <div class="editorContainer">
      <ReplyEditor />
      <Icon
        class="editorAction"
        medium
        name="addAnImage"
        dark
      />
    </div>
    <Fab>
      <Icon
        name="send"
      />
    </Fab>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Icon from '../material/Icon.vue'
import Fab from '../material/Fab.vue'
import ReplyEditor from './ReplyEditor.vue'

export default defineComponent({
  name: 'FloatingReplyAction',
  components: { Icon, Fab, ReplyEditor }
})
</script>

<style lang="sass" scoped>
@import @/styles/box-shadow.sass

.floatingReplyActions
  display: flex

.editorContainer
  @include Rise4()
  background-color: var(--chroma-primary-g)
  min-height: 56px // ( 3 * 24 - 16 )px
  max-height: 96px
  border-radius: 28px
  flex-grow: 1
  margin-right: 8px
.editorAction
  opacity: 75%
</style>
