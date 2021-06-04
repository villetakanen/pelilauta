<template>
  <Toolbar>
    <h3>{{ title }}</h3>
    <div class="spacer" /><Action
      v-if="isAdmin"
      to="stylebook"
      prepend="d20"
    >
      {{ $t('admin.action.stylebook') }}
    </Action>
    <Action
      v-if="isAdmin"
      to="/thread/add"
      prepend="lightbulb"
    >
      {{ $t('action.addThread') }}
    </Action>
    <Action
      v-if="isAdmin"
      to="global.admin.editorTest"
      prepend="edit"
    >
      {{ $t('admin.action.editorTest') }}
    </Action>
    <Action
      v-if="isAdmin"
      to="global.admin.topics"
      prepend="books"
    >
      {{ $t('admin.action.topics') }}
    </Action>
    <Action
      v-if="isAdmin"
      to="global.admin"
      prepend="admin"
    >
      {{ $t('action.admin') }}
    </Action>
  </Toolbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Toolbar from '@/components/layout/Toolbar.vue'
import Action from '../material/Action.vue'
import { useAuthState } from '@/state/authz'

export default defineComponent({
  components: {
    Toolbar,
    Action
  },
  props: {
    title: {
      type: String,
      required: false,
      default: 'Title'
    }
  },
  setup () {
    const { isAdmin } = useAuthState()
    return { isAdmin }
  }
})
</script>
