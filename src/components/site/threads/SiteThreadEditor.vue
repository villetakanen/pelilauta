<template>
  <Column>
    <Loader
      v-if="!site || !site.id"
      poster
    />
    <template v-else>
      <Textfield
        v-model="v.threadTitle.$model"
        :label="$t('threads.title')"
        :error="v.threadTitle.$error"
      />
      <RichTextEditor
        v-model:content="threadContent"
        style="margin-top:8px"
      />
      <Toolbar>
        <TopicSelector v-model="threadTopic" />
        <Chip
          :label="site.name"
          :icon="site.systemBadge + '-logo'"
        />
        <Button>{{ $t('action.save') }}</Button>
      </Toolbar>
    </template>
  </Column>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import Column from '@/components/layout/Column.vue'
import { useSite } from '@/state/site'
import Loader from '@/components/app/Loader.vue'
import Textfield from '@/components/form/Textfield.vue'
import Chip from '@/components/material/Chip.vue'
import { useThreads } from '@/state/threads'
import useVuelidate from '@vuelidate/core'
import { maxLength } from '@/utils/contentFormat'
import { required } from '@vuelidate/validators'
import Toolbar from '@/components/layout/Toolbar.vue'
import TopicSelector from '@/components/thread/TopicSelector.vue'
import Button from '@/components/form/Button.vue'
import RichTextEditor from '@/components/quill/RichTextEditor.vue'

export default defineComponent({
  name: 'TextStyles',
  components: { Column, Loader, Textfield, Chip, Toolbar, TopicSelector, Button, RichTextEditor },
  props: {
    threadid: {
      type: String,
      required: false,
      default: ''
    },
    topic: {
      type: String,
      required: false,
      default: 'Yleinen'
    },
    siteid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { site } = useSite(props.siteid)
    const { thread } = useThreads()

    console.log('siteThreadEditor', props.siteid, props.threadid, props.topic)

    const originalThread = computed(() => (thread.value))

    const dirtyTitle = ref('')
    const threadTitle = computed({
      get: () => (dirtyTitle.value || originalThread.value.data.title || ''),
      set: (val: string) => {
        if (val !== dirtyTitle.value) {
          dirtyTitle.value = val
        }
      }
    })

    const dirtyTopic = ref('')
    const threadTopic = computed({
      get: () => (dirtyTopic.value || originalThread.value.data.topic || props.topic),
      set: (val: string) => {
        if (val !== dirtyTopic.value) {
          dirtyTopic.value = val
        }
      }
    })

    const dirtyContent = ref('')
    const threadContent = computed({
      get: () => (dirtyContent.value || originalThread.value.data.content || ''),
      set: (val: string) => {
        if (val !== dirtyContent.value) {
          dirtyContent.value = val
        }
      }
    })

    const rules = {
      threadTitle: { required, maxLength }
    }
    const v = useVuelidate(rules, { threadTitle })

    return { site, v, threadTopic, threadContent }
  }
})
</script>
