<template>
  <div class="attachmentRow">
    <div><h1>{{ attachment[1].name }}</h1></div>
    <div class="image-box">
      <img
        :src="attachment[1].url"
        alt=""
      >
    </div>
    <MaterialButton>{{ $t('action.delete') }}</MaterialButton>
  </div>
</template>

<script lang="ts">
import { Attachment } from '@/state/site/attachments'
import { defineComponent, PropType } from 'vue'
import MaterialButton from '../material/MaterialButton.vue'

export default defineComponent({
  name: 'AttachmentRow',
  components: {
    MaterialButton
  },
  props: {
    attachment: {
      type: Object as PropType<Attachment>,
      required: true
    }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.attachmentRow
  padding-bottom: 8px

.attachmentRow + .attachmentRow
  border-top: solid 1px $color-fill-tertiary
  padding-top: 7px

</style>
