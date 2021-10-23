<template>
  <Header
    v-if="showExperimentalTools"
    class="editThreadHeader"
  >
    <ViewTitle icon="addDiscussion">
      {{ threadid ? $t('threads.edit.title') : $t('threads.add.title') }}
    </ViewTitle>
    <SpacerDiv />
    <MaterialMenu v-model="menu" />
  </Header>
</template>

<script lang="ts">
import Header from '@/components/layout/Header.vue'
import SpacerDiv from '@/components/layout/SpacerDiv.vue'
import ViewTitle from '@/components/layout/ViewTitle.vue'
import MaterialMenu from '@/components/material/MaterialMenu.vue'
import { useAuth } from '@/state/authz'
import { computed, defineComponent } from 'vue'
import { MenuItem } from '@/utils/uiInterfaces'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  components: { Header, ViewTitle, SpacerDiv, MaterialMenu },
  props: {
    threadid: {
      type: String,
      required: false,
      default: ''
    }
  },
  emits: ['addVideoLink'],
  setup (props, context) {
    const { showExperimentalTools } = useAuth()
    const i18n = useI18n()

    const menu = computed(() => {
      const arr = new Array<MenuItem>()
      arr.push({
        icon: 'youtube',
        action: () => {
          console.debug('emits: addVideoLink')
          context.emit('addVideoLink')
        },
        text: i18n.t('threads.edit.addVideoLink')
      })
      return arr
    })

    return { showExperimentalTools, menu }
  }
})
</script>
