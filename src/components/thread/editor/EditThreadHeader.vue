<template>
  <Header
    v-if="showExperimentalTools"
    class="editThreadHeader"
  >
    <ViewTitle icon="addDiscussion">
      {{ threadid ? $t('threads.edit.title') : $t('threads.add.title') }}
    </ViewTitle>
    <SpacerDiv />
    <MaterialMenu />
  </Header>
</template>

<script lang="ts">
import Header from '@/components/layout/Header.vue'
import SpacerDiv from '@/components/layout/SpacerDiv.vue'
import ViewTitle from '@/components/layout/ViewTitle.vue'
import MaterialMenu from '@/components/material/MaterialMenu.vue'
import { useAuth } from '@/state/authz'
import { defineComponent } from 'vue'
import { useThreads } from '@/state/threads'

export default defineComponent({
  components: { Header, ViewTitle, SpacerDiv, MaterialMenu },
  props: {
    threadid: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup () {
    const { showExperimentalTools } = useAuth()
    const { thread } = useThreads()
    return { showExperimentalTools, thread }
  }
})
</script>
