<template>
  <p class="caption cap">
    &nbsp;&nbsp;&nbsp;Reply
  </p>
  <div class="reply-form">
    <textarea
      v-model="reply"
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
import { useDiscussion } from '@/lib/discussion'
import { useAuthz } from '@/lib/authz'

export default defineComponent({
  name: 'ReplyForm',
  components: {
    MaterialButton
  },
  props: {
    postid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const reply = ref('')

    const send = () => {
      console.log('sending:', reply.value)
      const { addComment } = useDiscussion(props.postid)
      const { uid, profile } = useAuthz()
      addComment(uid.value, profile.value.nick, reply.value)
      reply.value = ''
    }
    return { reply, send }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.reply-form
  // border: solid 1px $color-primary-light
  @include BoxShadow3()
  background-color: white
  margin: 8px
  padding: 8px
  border-radius: 8px
  position: relative
  display: flex
  justify-content: space-between
  .box
    flex-grow: 1
    flex-shrink: 0
    margin-right: 8px
    border-radius: 4px
    background-color: $color-base-dark
    border: none
    padding: 4px
    height: 40px
    line-height: 20px
  .button
    flex-grow: 0
    flex-shrink: 0

p.cap.caption
  margin-top: 4px
  margin-left: 8px
  padding-left: 8px

</style>
