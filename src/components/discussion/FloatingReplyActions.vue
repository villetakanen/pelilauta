<template>
  <teleport to="#replyActionsContainer">
    <div id="floatingReplyActions">
      <div class="editorContainer">
        <span class="placeholder">{{ $t('replyEditor.placeholderText') }}</span>
        <ReplyEditor class="replyEditor contentBox" />
        <Icon
          class="editorAction"
          medium
          name="addAnImage"
          dark
        />
      </div>
      <Fab class="sendAction">
        <Icon
          name="send"
        />
      </Fab>
    </div>
  </teleport>
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

#floatingReplyActions
  @include Rise4()
  width: 100vw
  height: 56px
  background-color: var(--chroma-secondary-h)
  display: flex
  box-sizing: border-box
  padding: 8px
  transition: 0.3s
  .sendAction
    margin-top: -16px
    @include Rise4()
  .editorContainer
    background-color: var(--chroma-secondary-f)
    border: solid 1px var(--chroma-secondary-d)
    border-radius: 20px
    position: relative
    flex-grow: 1
    transition: 0.3s
    margin-right: 8px
#floatingReplyActions:focus-within
  height: calc(3 * 24px + 16px + 16px)
  .placeholder, .editorAction
    display: none
  .editorContainer
    height: calc(3 * 24px + 16px)
    border-radius: 16px
#floatingReplyActions:not(:focus-within)
  .editorContainer
    height: 40px
  .placeholder
    display: block
    font-style: italic
    color: var(--chroma-primary-h)
    position: absolute
    top: 8px
    left: 16px

.editorAction
  opacity: 75%
  position: absolute
  top: 4px
  right: 8px

</style>
