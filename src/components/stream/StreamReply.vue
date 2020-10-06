<template>
  <div class="stream-reply">
    <div class="reply-header toolbar">
      <div class="author">
        {{ nick }}
      </div>
      <div class="spacer" />
      <div
        v-if="isAuthor"
        class="mini-action"
        @click="showMenu=true"
      >
        <img

          src="@/assets/menu-ellipsis.svg"
        >
        <transition name="fade">
          <div
            v-if="showMenu"
            class="action-menu"
            @mouseleave="showMenu=false"
          >
            <p>Actions:</p>
            <MaterialButton
              text
              :action="deleteComment"
            >
              Delete
            </MaterialButton>
          </div>
        </transition>
      </div>
    </div>
    <div
      class="message"
      :innerHTML="content"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useAuthz } from '@/lib/authz'
import MaterialButton from '@/components/material/MaterialButton.vue'
import * as firebase from 'firebase/app'
import 'firebase/firestore'

export default defineComponent({
  components: {
    MaterialButton
  },
  props: {
    content: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    commentid: {
      type: String,
      required: true
    },
    postid: {
      type: String,
      required: true
    },
    nick: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { uid } = useAuthz()
    const isAuthor = computed(() => (props.author === uid.value))
    const showMenu = ref(false)
    const deleteComment = () => {
      const db = firebase.firestore()
      const commentRef = db.collection('stream').doc(props.postid).collection('comments').doc(props.commentid)
      commentRef.delete()
    }
    return { isAuthor, showMenu, deleteComment }
  }
})
</script>

<style lang="sass" scoped>
@import ../../styles/material-typography.sass
@import @/styles/material-colors.sass

#app #mainContentWrapper main
  .tester
    background-color: white
    height: 100px
    width: 100%
  p.caption
    padding-bottom: 4px
  div.stream-reply
    @include TypeBody2()
    padding-top: 8px
    div.author
      font-weight: 500
      margin:0
      margin-right: 8px
      padding:4px 0
      line-height: 16px
      color: $color-primary-light
      flex-grow: 0
    div.mini-action
      flex-grow: 0
      height: 24px
      width: 24px
      border-radius: 50px
      background: $color-base-dark
      position: relative
      img
        height: 22px
        width: 22px
        margin: 1px
      &:hover
        background: $color-base-darker
      div.action-menu
        position: absolute
        z-index: 4
        top: 12px
        right: 12px
        padding: 8px
        background-color: white
        @include BoxShadow8()

</style>
