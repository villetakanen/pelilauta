<template>
  <Header>
    <ViewTitle icon="admin">
      {{ title }}
    </ViewTitle>
    <SpacerDiv />
    <template v-if="showAdminTools">
      <Button
        text
        @click="$router.push('/admin')"
      >
        <Icon
          name="admin"
          small
        />
        {{ $t('action.admin') }}
      </Button>
      <Button
        text
        @click="$router.push('/stylebook')"
      >
        <Icon
          name="d20"
          small
        />
        {{ $t('stylebook.title') }}
      </Button>
      <Button
        text
        @click="$router.push('/rtesandbox')"
      >
        <Icon
          name="edit"
          small
        />
        {{ $t('rtesandbox.title') }}
      </Button>
      <Button
        text
        @click="$router.push('/admin/topics')"
      >
        <Icon
          name="books"
          small
        />
        {{ $t('admin.action.topics') }}
      </Button>
    </template>
  </Header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuth } from '@/state/authz'
import Header from '../layout/Header.vue'
import ViewTitle from '../layout/ViewTitle.vue'
import SpacerDiv from '../layout/SpacerDiv.vue'
import Button from '../form/Button.vue'
import Icon from '../material/Icon.vue'

export default defineComponent({
  components: {
    Header,
    ViewTitle,
    SpacerDiv,
    Button,
    Icon
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
