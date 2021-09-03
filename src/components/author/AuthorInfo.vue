<template>
  <div class="authorInfo">
    <router-link
      v-if="author.nick"
      :to="{ name: 'profile.public', params: { uid: author.uid }}"
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
        class="avatarButton"
        medium
        style="top: 12px; left: 12px"
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
      return a?.uid ? a : { nick: '', frozen: false }
    })
    return { author }
  }
})
</script>

<style lang="sass" scoped>
.authorInfo
  border-top: solid 1px var(--chroma-primary-g)
  position: relative
  height: 72px
  a
    text-decoration: none
  h4, p
    margin-left: 80px
  .avatarButton
    position: absolute
    top: 4px
    left: 4px
    height: 64px
    width: 64px
    border-radius: 50%
</style>
