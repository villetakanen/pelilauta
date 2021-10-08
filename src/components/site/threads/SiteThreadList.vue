<template>
  <div id="siteThreadList">
    <h1 class="title">
      {{ $t('site.threads.title') }}
    </h1>
    <ul>
      <ThreadListItem
        v-for="thread in siteThreads"
        :key="thread"
        :thread="thread"
      />
    </ul>
    <div class="toolbar">
      <div class="spacer" />
      <Button @click="newConvo">
        {{ $t('action.addThread') }}
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import Button from '@/components/form/Button.vue'
import ThreadListItem from '@/components/thread/ThreadListItem.vue'
import { useThreads } from '@/state/threads'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'SiteThreadList',
  components: {
    ThreadListItem,
    Button
  },
  props: {
    siteid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { siteThreads } = useThreads()

    const router = useRouter()
    function newConvo () {
      router.push('/site/' + props.siteid + '/add/thread')
    }
    return { siteThreads, newConvo }
  }
})
</script>

<style lang="sass" scoped>
#siteThreadList
  ul
    list-style-type: none
    margin-left: 0
    padding-left: 0
    li+li
      border-top: solid 1px var(--chroma-secondary-g)
      padding-top: 7px
</style>
