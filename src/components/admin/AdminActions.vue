<template>
  <Header>
    <ViewTitle icon="admin">
      {{ title }}
    </ViewTitle>
    <SpacerDiv />
    <Action
      v-if="showAdminTools"
      to="global.admin"
      prepend="admin"
    >
      {{ $t('action.admin') }}
    </Action>
    <Action
      v-if="showAdminTools"
      to="stylebook"
      prepend="d20"
    >
      {{ $t('admin.action.stylebook') }}
    </Action>
    <Action
      v-if="showAdminTools"
      to="global.admin.editorTest"
      prepend="edit"
    >
      {{ $t('admin.action.editorTest') }}
    </Action>
    <Action
      v-if="showAdminTools"
      to="global.admin.topics"
      prepend="books"
    >
      {{ $t('admin.action.topics') }}
    </Action>
  </Header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Action from '../material/Action.vue'
import { useAuth } from '@/state/authz'
import Header from '../layout/Header.vue'
import ViewTitle from '../layout/ViewTitle.vue'
import SpacerDiv from '../layout/SpacerDiv.vue'

export default defineComponent({
  components: {
    Action,
    Header,
    ViewTitle,
    SpacerDiv
  },
  props: {
    title: {
      type: String,
      required: false,
      default: 'Title'
    }
  },
  setup () {
    const { showAdminTools } = useAuth()
    return { showAdminTools }
  }
})
</script>
