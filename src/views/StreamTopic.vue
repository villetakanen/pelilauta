<template>
  <div class="toolbar">
    <ViewHeader>
      {{ pageTitle.title }}
    </ViewHeader>
    <div class="spacer" />
    <Fab
      style="margin: 4px"
      :action="newThread"
      :text="$t('action.addThread')"
    >
      <img
        src="@/assets/icons/add.svg"
        alt="new post"
      >
    </Fab>
  </div>
  <div class="contentGrid">
    <ThreadList :topic="routeTopic" />
  </div>
  <EditorDialog v-model="showEditorDialog" />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import ThreadList from '@/components/stream/ThreadList.vue'
import Fab from '@/components/material/Fab.vue'
import ViewHeader from '@/components/app/ViewHeader.vue'
import { useMeta } from '@/lib/meta'
import { useRoute } from 'vue-router'
import EditorDialog from '@/components/app/EditorDialog.vue'

export default defineComponent({
  name: 'StreamTopic',
  components: {
    ThreadList,
    ViewHeader,
    Fab,
    EditorDialog
  },
  props: {
    topic: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { topics, showStreamActions } = useMeta()

    const route = useRoute()
    const routeTopic = computed(() => {
      return Array.isArray(route.params.topic) ? route.params.topic[0] : route.params.topic
    })

    const pageTitle = computed(() => {
      if (!topics.value || topics.value.length < 1) return { title: routeTopic.value }
      const t = topics.value.find((val) => (val.slug.toLowerCase() === routeTopic.value.toLowerCase()))
      if (t) return t
      return { title: routeTopic.value }
    })

    const showEditorDialog = ref(false)

    const newThread = () => {
      showEditorDialog.value = true
    }

    return { pageTitle, showStreamActions, routeTopic, newThread, showEditorDialog }
  }
})
</script>
