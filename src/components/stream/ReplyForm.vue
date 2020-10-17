<template>
  <div
    v-if="isAuthz"
    class="reply-form"
  >
    <Editor
      v-model="reply"
      :lines="3"
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
  <div
    v-if="!isAuthz"
    style="text-align: center;padding: 16px"
  >
    {{ $t('global.messages.pleaseLogin') }}
    <MaterialButton
      to="/login"
      text
    >
      {{ $t('action.login') }}
    </MaterialButton>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import Editor from '@/components/editor/Editor2.vue'
import { useDiscussion } from '@/lib/discussion'
import { useAuthz } from '@/lib/authz'

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
  setup (props) {
    const { isAuthz } = useAuthz()
    const reply = ref('')

    const send = () => {
      console.log('sending:', reply.value)
      const { addComment } = useDiscussion(props.postid)
      const { uid, profile } = useAuthz()
      addComment(uid.value, profile.value.nick, reply.value)
      reply.value = ''
    }

    return { reply, send, isAuthz }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.reply-form
  // border: solid 1px $color-primary-light
  background-color: $color-base-darker
  margin: 8px
  padding: 8px
  border-radius: 8px
  position: relative
  // display: flex
  // justify-content: space-between
  // width: 100%
  .box
    flex-grow: 1
    flex-shrink: 0
    margin-right: 8px
    border-radius: 4px
    background-color: $color-base-dark
    border: none
    padding: 4px
    height: 60px
    line-height: 20px
    margin-right: 70px
  .box:after
    content: ""
    position: absolute
    border-style: solid
    border-color: transparent $color-base-dark
    top: 16px // controls vertical position
    right: 64px // value = - border-left-width - border-right-width */
    border-width: 8px 0px 8px 16px
    bottom: auto
  .button
    position: absolute
    right: 8px
    top: 16px

p.cap.caption
  margin-top: 4px
  margin-left: 8px
  padding-left: 8px

</style>
