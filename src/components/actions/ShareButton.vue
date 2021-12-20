<template>
  <Button
    text
    @click="copyLinkToClipboard()"
  >
    <Icon
      name="share"
      small
    />
    <span class="onlyForDesktop">{{ $t('action.share') }}</span>
  </Button>
</template>

<script lang="ts">
import { useUxActions } from '@/composables/useUxActions'
import { defineComponent } from 'vue'
import Button from '../form/Button.vue'
import Icon from '../material/Icon.vue'
export default defineComponent({
  name: 'StatefulComponents',
  components: { Button, Icon },
  setup () {
    const { copyLinkToClipboard } = useUxActions()
    return { copyLinkToClipboard }
  }
})
</script>
