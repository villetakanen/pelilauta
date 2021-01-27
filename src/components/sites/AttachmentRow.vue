<template>
  <div class="attachmentRow">
    <div><h1>{{ attachment[1].name }}</h1></div>
    <div class="image-box">
      <img
        :src="attachment[1].url"
        alt=""
      >
    </div>
    <MaterialButton
      color="tertiary"
      :async-action="deleteAttachment"
      :disabled="!canEdit"
    >
      {{ $t('action.delete') }}
    </MaterialButton>
  </div>
</template>

<script lang="ts">
import { useAuthState } from '@/state/authz'
import { useSite } from '@/state/site'
import { Attachment } from '@/state/site/attachments'
import { computed, defineComponent, PropType } from 'vue'
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
  },
  setup () {
    const canEdit = computed(() => {
      const { hasAdmin } = useSite()
      const { uid } = useAuthState()
      console.log(uid.value, hasAdmin(uid.value))
      return hasAdmin(uid.value)
    })

    function deleteAttachment () {

    }

    return { canEdit, deleteAttachment }
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
