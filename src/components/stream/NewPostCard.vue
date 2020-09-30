<template>
  <MaterialCard>
    <p v-if="!isAuthz">Please <a href="/login">login</a> to post</p>
    <textarea v-model="newPostContent"></textarea>
    {{newPostContent}}
    <MaterialButton :disabled="isAuthz">Post!</MaterialButton>
  </MaterialCard>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import { useAuthz } from '@/lib/authz'

export default defineComponent({
  name: 'Home',
  components: {
    MaterialButton,
    MaterialCard
  },
  setup () {
    const { isAuthz } = useAuthz()
    const newPostContent = ref('')
    return { isAuthz, newPostContent }
  }
})
</script>

<style lang="sass" scoped>
textarea
 display: block
 width: 100%
 height: 5em
 border: none
 resize: none
</style>
