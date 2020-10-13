<template>
  <div class="discussion">
    <ReplyForm :postid="postid" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ReplyForm from './ReplyForm.vue'

export default defineComponent({
  name: 'Discussion',
  components: {
    ReplyForm
  },
  props: {
    postid: {
      type: String,
      required: true
    }
  }
})
</script>

<style lang="sass" scoped>

</style>
