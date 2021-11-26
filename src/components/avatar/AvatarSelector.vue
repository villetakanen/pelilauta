<template>
  <div class="AvatarSelector">
    <img
      :src="avatarUrl"
      alt="Avatar"
      class="preview"
      @click="selectDialog = true"
    >
    <img
      src="@/assets/icons/dark/edit.svg"
      alt=""
      class="hoverInteraction"
    >
    <Dialog v-model="selectDialog">
      <div class="flexList">
        <img
          v-if="forUser"
          class="selectableImage"
          :src="user.defaultAvatarURL"
          alt="Avatar"
          @click="setAvatar(user.defaultAvatarURL)"
        >
        <img
          v-for="asset in assets"
          :key="asset[0]"
          :src="asset[1].url"
          :alt="asset[1].name"
          class="selectableImage"
          @click="setAvatar(asset[1].url)"
        >
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { useAuth } from '@/state/authz'
import { useAssets } from '@/state/assets'
import { logDebug } from '@/utils/eventLogger'
import { computed, defineComponent, ref } from 'vue'
import Dialog from '../material/Dialog.vue'

export default defineComponent({
  name: 'AvatarSelector',
  components: { Dialog },
  props: {
    forUser: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    const selectDialog = ref(true)
    const { user } = useAuth()
    const { assets } = useAssets()
    const selectedUrl = ref(props.modelValue)
    const avatarUrl = computed({
      get: () => {
        if (!selectedUrl.value) {
          return '/icons/fox-icon-96.png'
        }
        return selectedUrl.value
      },
      set: (value) => {
        selectedUrl.value = value
        context.emit('update:modelValue', value)
      }
    })

    function setAvatar (avatar:string) {
      logDebug('AvatarSelector', 'setAvatar', avatar)
      avatarUrl.value = avatar
      selectDialog.value = false
    }

    return { avatarUrl, selectDialog, user, setAvatar, assets }
  }
})
</script>

<style lang="sass" scoped>
.AvatarSelector
  height: 96px
  width: 96px
  margin: 6px
  padding: 0
  position: relative
  img
    height: 96px
    width: 96px
    margin: 0
    padding: 0
    border-radius: 48px
    &.hoverInteraction
      pointer-events: none
      position: absolute
      top: 12px
      left: 12px
      height: 72px
      width: 72px
      opacity: 0
      filter: drop-shadow( 0px 0px 6px var(--chroma-secondary-a))
      border-radius: 0
      transition: opacity 0.2s ease-in-out
  &:hover
    img.hoverInteraction
      opacity: 0.77
img.selectableImage
    height: 48px
    width: 48px
    border-radius: 24px
    color: var(--chroma-clear)
</style>
