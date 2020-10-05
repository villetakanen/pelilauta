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
      float: left
      font-weight: 500
      margin:0
      margin-right: 8px
      padding:4px 8px
      line-height: 16px
      color: $color-primary-light
      border-radius: 12px
      background-color: $color-base-dark

</style>
