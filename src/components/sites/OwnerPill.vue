<template>
  <Pill :action="(actions && uid !== currentAuthor) ? action : null">
    {{ owner.nick }}
  </Pill>
</template>

<script lang="ts">
import { useAuthors } from '@/lib/authors'
import { useAuthState } from '@/state/authz'
import { useSite } from '@/state/site'
import { computed, defineComponent } from 'vue'
import Pill from '../material/Pill.vue'

export default defineComponent({
  components: { Pill },
  props: {
    uid: {
      type: String,
      required: true
    },
    add: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup (props) {
    const { getAuthor } = useAuthors()
    const { uid: currentAuthor } = useAuthState()
    const { hasAdmin, revokeOwner, addOwner } = useSite()
    const actions = computed(() => hasAdmin(currentAuthor.value))
    const owner = computed(() => (getAuthor(props.uid)))
    function action () {
      if (props.add) addOwner(props.uid)
      else revokeOwner(props.uid)
    }
    return { owner, actions, currentAuthor, action }
  }
})
</script>
