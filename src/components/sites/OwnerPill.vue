<template>
  <Pill :action="(actions && uid !== currentAuthor) ? revoke : null">
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
    }
  },
  setup (props) {
    const { getAuthor } = useAuthors()
    const { uid: currentAuthor } = useAuthState()
    const { hasAdmin, revokeOwner } = useSite()
    const actions = computed(() => hasAdmin(currentAuthor.value))
    const owner = computed(() => (getAuthor(props.uid)))
    function revoke () {
      revokeOwner(props.uid)
    }
    return { owner, actions, currentAuthor, revoke }
  }
})
</script>
