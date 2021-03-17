<template>
  <div>
    <div style="margin: 0 8px">
      <Toolbar>
        <h3 v-if="stream">
          {{ stream.name }}
        </h3>
      </Toolbar>
    </div>
    <div class="contentGrid">
      <ThreadList :topic="routeTopic" />
    </div>
    <teleport to="#ScreenBottomFloatRight">
      <Fab
        v-if="!isAnonymous && stream"
        :to="`/stream/topic/${stream.slug}/post`"
        :text="$t('action.addThread')"
      >
        <img
          src="@/assets/icons/add.svg"
          alt="new post"
        >
      </Fab>
    </teleport>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import ThreadList from '@/components/stream/ThreadList.vue'
import Fab from '@/components/material/Fab.vue'
import { useMeta } from '@/state/meta'
import { useRoute } from 'vue-router'
import { useAuthState } from '@/state/authz'
import Toolbar from '@/components/layout/Toolbar.vue'

export default defineComponent({
  name: 'StreamTopic',
  components: {
    ThreadList,
    Fab,
    Toolbar
  },
  props: {
    topic: {
      type: String,
      required: true
    }
  },
  setup () {
    const { streams } = useMeta()

    const route = useRoute()
    const routeTopic = computed(() => {
      return Array.isArray(route.params.topic) ? route.params.topic[0] : route.params.topic
    })

    const stream = computed(() => {
      return streams.value.find((val) => (val.slug.toLowerCase() === routeTopic.value.toLowerCase()))
    })

    const showEditorDialog = ref(false)

    const newThread = () => {
      showEditorDialog.value = true
    }

    const { isAnonymous } = useAuthState()

    return { stream, routeTopic, newThread, showEditorDialog, isAnonymous }
  }
})
</script>
