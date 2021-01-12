<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="message"
        id="snackBar"
      >
        <h1>{{ message.topic }}</h1>
        <p v-if="message.message">
          {{ message.message }}
        </p>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, watch, ref, Ref } from 'vue'
import { useSnack } from '@/composables/useSnack'
import { SnackMessage } from '@/composables/useSnack/useSnack'

export default defineComponent({
  setup () {
    const { popSnack, snackMessages, snackStackLength } = useSnack()
    const message:Ref<SnackMessage|null> = ref(null)
    watch(snackStackLength, () => {
      console.log('stack change', message.value, snackMessages.value)
      if (snackMessages.value.length > 0 && message.value === null) {
        message.value = snackMessages.value[snackMessages.value.length - 1]
        console.log('showing', message.value)
        setTimeout(() => {
          console.log('flushing')
          message.value = null
          setTimeout(() => { popSnack() }, 1000)
        }, 5000) // show the snack for 30 seconds
      }
    }, { immediate: true })
    return { message }
  }
})
</script>

<style lang="sass">
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

#snackBar
  @include BoxShadow24()
  position: fixed
  bottom: 16px
  left: 16px
  width: 90vw
  height: 72px
  background-color: $color-fill-dark
  border-radius: 16px
  z-index: 30000
  h1
    @include TypeBody1()
    padding: 12px 16px
    padding-bottom: 0
    color: $color-dark-font-high
  p
    @include TypeBody2()
    padding: 12px 16px
    padding-top: 0
    color: $color-dark-font-medium
</style>
