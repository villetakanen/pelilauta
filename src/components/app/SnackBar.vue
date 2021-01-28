<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="message"
        id="snackContainer"
      >
        <div
          id="snackBar"
        >
          <h1>{{ message.topic }}</h1>
          <p v-if="message.message">
            {{ message.message }}
          </p>
          <MaterialButton
            v-if="message.action"
            id="snackAction"
            :action="snackAction"
            dark
          >
            Ok
          </MaterialButton>
          <MaterialButton
            id="snackHide"
            icon
            dark
            :action="dismiss"
          >
            <Icon
              name="close"
              color="dark"
            />
          </MaterialButton>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, watch, ref, Ref } from 'vue'
import { useSnack } from '@/composables/useSnack'
import { SnackMessage } from '@/composables/useSnack/useSnack'
import MaterialButton from '@/components/material/MaterialButton.vue'
import Icon from '../material/Icon.vue'

export default defineComponent({
  components: {
    MaterialButton,
    Icon
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

#snackContainer
  position: fixed
  bottom: 72px
  left: 0px
  width: 100vw
  height: 104px

#snackBar
  @include BoxShadow24()
  position: relative
  margin: 16px
  height: 72px
  background-color: $color-fill-dark
  border-radius: 8px
  z-index: 30000
  #snackHide
    position: absolute
    top: 8px
    right: 8px
  #snackAction
    position: absolute
    top: 16px
    right: 56px
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
