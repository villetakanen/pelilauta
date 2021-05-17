<template>
  <Chip
    :label="nick"
    :delete-function="deleteFunction"
    :disabled="activeUserUid === uid"
  />
</template>

<script lang="ts">
import Chip from '@/components/material/Chip.vue'
import { useAuthors } from '@/state/authors'
import { useAuthState } from '@/state/authz'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  components: { Chip },
  props: {
    uid: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup (props) {
    const { authors } = useAuthors()
    const { uid: activeUserUid } = useAuthState()
    const nick = computed(() => (authors.value.find((a) => (a.uid === props.uid))?.nick || 'anonymous'))
    const deleteFunction = async () => {
      console.debug('... deletefunction ...')
    }
    return { nick, deleteFunction, activeUserUid }
  }
})
</script>
