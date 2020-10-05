<template>
  <div class="stream-reply">
    <div class="author">
      {{ nick }}
    </div>
    <div
      class="message"
      :innerHTML="content"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    content: {
      type: String,
      required: true
    },
    author: {
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
  }
})
</script>

<style lang="sass" scoped>
@import ../../styles/material-typography.sass

#app #mainContentWrapper main
  .tester
    background-color: white
    height: 100px
    width: 100%
  p.caption
    padding-bottom: 4px
  .reply
    border-top: solid 1px rgba(0,0,0,0.1)
    margin-top: 4px
    padding-top: 3px
    @include TypeBody2()
    div.author
      float: left
      font-weight: 500
      margin:0
      margin-right: 8px
      padding:4px 8px
      line-height: 16px
      color: #666
      border-radius: 12px
      background-color: white

</style>
