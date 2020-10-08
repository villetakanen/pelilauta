<template>
  <div class="PostHeader toolbar">
    <div class="avatar">
      <transition name="fade">
        <img
          v-if="photo"
          :src="photo"
          :alt="nick"
        >
        <img
          v-else
          src="@/assets/discuss.svg"
        >
      </transition>
    </div>
    <div class="InfoBar">
      <h3 class="title">
        <router-link :to="`/stream/view/${postid}`">
          {{ title }}
        </router-link>
      </h3>
      <div class="caption">
        {{ nick }} {{ created }}
        <span v-if="topic">in
          <router-link :to="`/stream/topic/${tslug}`">{{ topic }}</router-link>
        </span>
      </div>
    </div>
    <div class="spacer" />
    <div>
      <MaterialMenu v-model="menu" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import MaterialMenu from '@/components/material/MaterialMenu.vue'
import { MenuItem, useStream } from '@/lib/stream'
import { useAuthz } from '@/lib/authz'
import { useMeta } from '@/lib/meta'

export default defineComponent({
  name: 'PostHeader',
  components: {
    MaterialMenu
  },
  props: {
    nick: {
      type: String,
      required: false,
      default: ''
    },
    photo: {
      type: String,
      required: false,
      default: ''
    },
    title: {
      type: String,
      required: true
    },
    postid: {
      type: String,
      required: true
    },
    created: {
      type: String,
      required: false,
      default: ''
    },
    topic: {
      type: String,
      required: false,
      default: 'Yleinen'
    },
    tslug: {
      type: String,
      required: false,
      default: 'yleinen'
    },
    author: {
      type: String,
      required: false,
      default: '-'
    }
  },
  setup (props) {
    const { uid } = useAuthz()
    const { isAdmin } = useMeta()
    const showAdminTools = computed(() => (isAdmin(uid.value)))
    function drop () {
      console.log('Delete!', props.postid)
      const { dropPost } = useStream()
      dropPost(uid.value, props.postid)
    }

    const menu = computed(() => {
      const arr = new Array<MenuItem>()
      arr.push({ to: '/stream/view/' + props.postid, text: 'Open' })
      if (isAdmin(uid.value) || uid.value === props.author) {
        arr.push({ to: '/stream/edit/' + props.postid, icon: 'edit', text: 'Edit' })
        arr.push({ action: drop, text: 'Delete!' })
      }
      return arr
    })

    return { showAdminTools, menu }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.PostHeader
  .avatar
    @include ElementColorPrimaryLight()
    width: 40px
    height: 40px
    border-radius: 50%
    overflow: hidden
    margin: 0
    padding: 2px
    img
      height: 40px
      width: 40px
      margin: 0
      padding: 0
      border-radius: 50%
  .InfoBar
    padding-left: 8px
    padding-right: 8px
  .caption
    @include TypeCaption()

</style>
