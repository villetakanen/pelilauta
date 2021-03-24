<template>
  <div class="attachmentRow">
    <div><h1>{{ attachment.name }}</h1></div>
    <div class="image-box">
      <img
        :src="attachment.url"
        alt=""
      >
    </div>
    <div
      v-if="canEdit"
      class="filedata"
    >
      <p>{{ attachment.fullPath }}</p>
      <p>{{ attachment.url }}</p>
    </div>
    <MaterialButton
      color="tertiary"
      :action="deleteAttachment"
      :disabled="!canEdit"
    >
      {{ $t('action.delete') }}
    </MaterialButton>
  </div>
</template>

<script lang="ts">
import { useSnack } from '@/composables/useSnack'
import { useAuthState } from '@/state/authz'
import { Site, useSite } from '@/state/site'
import { Attachment, refreshStorage } from '@/state/site/attachments'
import { computed, ComputedRef, defineComponent, inject, PropType } from 'vue'
import MaterialButton from '../material/MaterialButton.vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'
import 'firebase/storage'

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
  setup (props) {
    const canEdit = computed(() => {
      const { hasAdmin } = useSite()
      const { uid } = useAuthState()
      console.log(uid.value, hasAdmin(uid.value))
      return hasAdmin(uid.value)
    })

    function deleteAttachment () {
      const storage = firebase.storage()
      // Create a reference to the file to delete
      const desertRef = storage.ref().child(props.attachment.fullPath)

      // Delete the file
      desertRef.delete().then(() => {
        // File deleted successfully
        const { pushSnack } = useSnack()
        pushSnack({ topic: 'File deleted', message: 'This can not be undone' })
        const site = inject('site') as ComputedRef<Site>
        refreshStorage(site.value.id)
      }).catch((error: firebase.storage.FirebaseStorageError) => {
        // Uh-oh, an error occurred!
        const { pushSnack } = useSnack()
        console.error(error)
        pushSnack({ topic: 'Error', message: 'This can not be undone', code: error.code })
      })
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
  .filedata
    padding-bottom: 8px
    p
      @include TypeCaption()
      color: $color-font-disabled
      margin: 4px
      padding: 0
    p + p
      border-top: solid 1px $color-fill-tertiary

.attachmentRow + .attachmentRow
  border-top: solid 1px $color-fill-tertiary
  padding-top: 7px

</style>
