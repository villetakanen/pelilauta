<template>
  <div class="mediaTool">
    <h3>{{ $t('thread.editor.mediaTool.title') }}</h3>
    <p>{{ $t('thread.editor.mediaTool.text') }}</p>
    <div v-if="thread.data.youTubeSlug">
      <iframe
        title="Youtube Preview"
        :src="`https://www.youtube.com/embed/${thread.data.youTubeSlug}?enablejsapi=1&origin=http://example.com`"
        frameborder="0"
      />
    </div>
    <div class="toolbar">
      <TextField v-model="slug" />
      <MaterialButton :async-action="saveSlug">
        {{ $t('action.save') }}
      </MaterialButton>
    </div>
  </div>
</template>

<script lang="ts">
import { Thread } from '@/utils/firestoreInterfaces'
import { defineComponent, PropType, ref } from 'vue'
import MaterialButton from '../material/MaterialButton.vue'
import TextField from '../material/TextField.vue'
import { updateThread } from '@/state/threads/threads'
import { useAuthState } from '@/state/authz'

export default defineComponent({
  components: { TextField, MaterialButton },
  props: {
    thread: {
      type: Object as PropType<Thread>,
      required: true
    }
  },
  setup (props) {
    const slug = ref(props.thread.data.youTubeSlug || '')
    const { uid } = useAuthState()

    async function saveSlug () {
      const updatedThread:Thread = { ...props.thread }
      updatedThread.data.youTubeSlug = slug.value || ''
      updateThread(uid.value, updatedThread)
    }
    return { slug, saveSlug }
  }
})
</script>
<style lang="sass" scoped>
.mediaTool
  background-color: rgba(var(--chroma-primary-c-rgba), 0.22)
  padding: 8px
  margin-bottom: 8px
</style>
