<template>
  <div class="small materialAction">
    1
    <LoveAction />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LoveAction from '../app/LoveAction.vue'
export default defineComponent({
  components: { LoveAction },
  props: {
    authorid: {
      type: String,
      required: true
    },
    replyid: {
      type: String,
      required: true
    }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass
@import @/styles/material-colors.sass
@import @/styles/layout.sass

</style>
