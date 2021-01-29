<template>
  <div
    id="snackContainer"
  >
    <transition name="fade">
      <div
        v-if="message"
        id="snackBar"
      >
        <p>
          {{ message.topic }}
          {{ message.message }}
          {{ message.code }}

          <MaterialButton
            v-if="message.action"
            id="snackAction"
            :action="snackAction"
            dark
            text
          >
            {{ message.actionMessage || 'X' }}
          </MaterialButton>
        </p>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, Ref } from 'vue'
import { useSnack } from '@/composables/useSnack'
import { SnackMessage } from '@/composables/useSnack/useSnack'
import MaterialButton from '@/components/material/MaterialButton.vue'

export default defineComponent({
  components: {
    MaterialButton
  },
  setup () {
    const { popSnack, snackMessages, snackStackLength } = useSnack()
    const message:Ref<SnackMessage|null> = ref(null)

    watch(snackStackLength, () => {
      if (snackMessages.value.length > 0 && message.value === null) {
        message.value = snackMessages.value[snackMessages.value.length - 1]
        if (!message.value.action) {
          // There is no way to close the snack --> hide it after a while
          setTimeout(() => {
            message.value = null
            setTimeout(() => {
              popSnack()
            }, 1000)
          }, 5000)
        }
      }
    }, { immediate: true })

    function dismiss () {
      message.value = null
      popSnack()
    }

    function snackAction () {
      if (message.value && message.value.action) {
        message.value.action()
        dismiss()
      }
    }
    return { message, snackAction, dismiss }
  }
})
</script>

<style lang="sass">
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

#snackBar
  @include BoxShadow24()
  position: relative
  max-height: 96px
  background-color: $color-fill-dark
  border-radius: 8px
  #snackAction
    display: inline-block
    margin: 0
    margin-left: 8px
  p
    @include TypeBody2()
    padding: 16px
    color: $color-dark-font-medium

@include media('<tablet')
  #snackBar
    max-height: 120px
    #snackAction
      display: block
      margin: 8px 0px
</style>
