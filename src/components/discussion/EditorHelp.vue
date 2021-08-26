<template>
  <div v-if="showMemberTools">
    <p class="helpertext">
      <span class="nick">©nick</span>{{ $t('reply.editor.helpertext') }}
    </p>
  </div>
</template>

<script lang="ts">
import { useAuth } from '@/state/authz'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EditorHelp',
  setup () {
    const { showMemberTools } = useAuth()
    return { showMemberTools }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass

.helpertext
  @include TypeCaption()
  font-style: italic
  margin: 0 16px
  color: var(--chroma-secondary-e)
.nick
  background-color: var(--chroma-secondary-h)
  padding: 0 8px
  border-radius: 12px
  margin-right: 4px
  font-style: normal
  font-weight: bold
  color: var(--chroma-secondary-c)
</style>
