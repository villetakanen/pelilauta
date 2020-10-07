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
    <div v-if="showAdminTools">
      <MaterialAction
        icon="admin-secondary"
        class="admin-action"
      />
    </div>
    <div>
      <MaterialAction icon="more" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import MaterialAction from '@/components/material/MaterialAction.vue'
import { useAuthz } from '@/lib/authz'
import { useMeta } from '@/lib/meta'

export default defineComponent({
  name: 'PostHeader',
  components: {
    MaterialAction
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
    }
  },
  setup () {
    const { uid } = useAuthz()
    const { isAdmin } = useMeta()
    const showAdminTools = computed(() => (isAdmin(uid.value)))
    return { showAdminTools }
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
