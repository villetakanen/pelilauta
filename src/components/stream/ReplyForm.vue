<template>
  <div class="reply-form">
    <Editor
      v-if="!sending"
      v-model="reply"
      small
      class="box"
    />
    <MaterialButton
      icon
      class="button"
      color="secondary"
      :action="send"
    >
      <img src="@/assets/send.svg">
    </MaterialButton>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import Editor from '@/components/editor/Editor.vue'

export default defineComponent({
  name: 'ReplyForm',
  components: {
    MaterialButton,
    Editor
  },
  props: {
    postid: {
      type: String,
      required: true
    }
  },
  setup () {
    const reply = ref('')
    const sending = ref(false)
    const send = () => {
      console.log('sending:', reply.value)
      sending.value = true
      reply.value = ''
      sending.value = false
    }
    return { reply, send, sending }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.reply-form
  border: solid 1px $color-primary-light
  margin: 8px 0
  padding: 8px
  border-radius: 8px
  position: relative
  display: flex
  justify-content: space-between
  .box
    flex-grow: 1
    flex-shrink: 0
    margin-right: 8px
  .button
    flex-grow: 0
    flex-shrink: 0

</style>
