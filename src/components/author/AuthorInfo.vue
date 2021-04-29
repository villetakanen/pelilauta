<template>
  <div class="authorInfo">
    <router-link
      v-if="nick"
      :to="{ name: 'profile.public', params: { uid: authoruid }}"
    >
      <img
        v-if="author.photoURL"
        :src="author.photoURL"
        aria-hidden
        alt=""
        class="avatarButton"
      >
      <Icon
        v-else
        name="avatar"
      />
      <h4>{{ author.nick }}</h4>
      <p>{{ author.tagline }}</p>
    </router-link>
  </div>
</template>

<script lang="ts">
import { useAuthors } from '@/state/authors'
import { PublicProfile } from '@/state/authz'
import { computed, ComputedRef, defineComponent } from 'vue'
import Icon from '../material/Icon.vue'

export default defineComponent({
  name: 'AuthorInfo',
  components: { Icon },
  props: {
    authorid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { authors } = useAuthors()
    const author:ComputedRef<PublicProfile> = computed(() => {
      const a = authors.value.find((v) => (v.uid === props.authorid))
      return a?.uid ? a : { nick: '' }
    })
    return { author }
  }
})
</script>
