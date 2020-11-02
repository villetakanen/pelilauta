<template>
  <h1 class="viewHeader">
    {{ pageTitle.title }}
  </h1>
  <teleport to="body">
    <MaterialFab
      v-if="showStreamActions"
      text="New post"
      :action="newPostDialog"
    >
      <img
        src="@/assets/add.svg"
        alt="new comment"
      >
    </MaterialFab>
  </teleport>
  <Stream :topic="routeTopic" />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import Stream from '@/components/stream/Stream.vue'
import MaterialFab from '@/components/material/MaterialFab.vue'
import { useMeta } from '@/lib/meta'
import { useEditorDialog } from '@/lib/editor'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'StreamTopic',
  components: {
    Stream,
    MaterialFab
  },
  props: {
    topic: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { topics } = useMeta()

    const route = useRoute()
    const routeTopic = ref('')
    onMounted(() => {
      if (route?.params?.topic) routeTopic.value = route.params.topic as string
      watch(route, (val) => {
        if (!route.params?.topic) {
          // eslint-disable-next-line
          console.warn('no topic')
        }
        routeTopic.value = val.params.topic as string
      })
    })

    const pageTitle = computed(() => {
      const t = topics.value.find((val) => (val.slug.toLowerCase() === routeTopic.value.toLowerCase()))
      if (t) return t
      return { title: '-' }
    })

    const { showStreamActions } = useMeta()

    const newPostDialog = () => {
      const { showEditor } = useEditorDialog()
      showEditor(props.topic)
    }

    return { pageTitle, showStreamActions, newPostDialog, routeTopic }
  }
})
</script>
