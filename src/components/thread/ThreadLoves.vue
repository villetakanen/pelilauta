<template>
  <div class="ThreadLoves">
    <img
      v-if="userLovesTheThread"
      src="@/assets/icons/love/loveIconBase.svg"
      class="loveIcon"
      alt="love"
    >
    {{ thread.lovedCount }}
  </div>
</template>

<script lang="ts">
import { useAuth } from '@/state/authz'
import { ThreadClass } from '@/state/threads/threads'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'ThreadLoves',
  components: { },
  props: {
    thread: {
      type: ThreadClass,
      required: true
    }
  },
  setup (props) {
    const { profileData } = useAuth()
    const userLovesTheThread = computed(() => profileData.value.lovedThreads?.includes(props.thread.id))
    return { userLovesTheThread }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass

div.ThreadLoves
  @include TypeBody2()
  font-weight: bold
  color: var(--chroma-secondary-d)
  background-color: var(--chroma-secondary-i)
  line-height: 20px
  height: 20px
  padding: 2px 12px
  padding-left: 32px
  border-radius: 12px
  margin: 0
  position: relative
  .loveIcon
    position: absolute
    top: 2px
    left: 8px
    height: 18px

</style>
