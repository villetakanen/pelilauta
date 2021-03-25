<template>
  <div class="assetListItem">
    <!-- thumbnail preview of the asset -->
    <div class="preview">
      <a :href="asset.url">
        <img
          :src="asset.url"
          alt="click to preview"
        >
      </a>
    </div>
    <div class="name">
      <h4>{{ asset.name }}</h4>
    </div>
    <div class="spacer" />
    <div class="actions">
      <MaterialButton icon @click="toggleInfo = !toggleInfo">
        <Icon name="about" />
      </MaterialButton>
      <MaterialButton
        icon
        :disabled="!crudActions"
      >
        <Icon name="remove" />
      </MaterialButton>
    </div>
    <div
      v-if="toggleInfo"
      class="filedata contentBox"
    >
      <p>{{ asset.creator }}</p>
      <p>{{ toDisplayString(asset.lastUpdate) }}</p>
      <p>{{ asset.url }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { useAuthState } from '@/state/authz'
import { useSite } from '@/state/site'
import { computed, defineComponent, PropType, ref } from 'vue'
import MaterialButton from '../../material/MaterialButton.vue'
import Icon from '@/components/material/Icon.vue'
import { Asset } from '@/state/site/assets'
import { toDisplayString } from '@/utils/firebaseTools'

export default defineComponent({
  name: 'AttachmentRow',
  components: {
    MaterialButton,
    Icon
  },
  props: {
    asset: {
      type: Object as PropType<Asset>,
      required: true
    }
  },
  setup () {
    const toggleInfo = ref(false)

    const crudActions = computed(() => {
      const { hasAdmin } = useSite()
      const { uid } = useAuthState()
      console.log(uid.value, hasAdmin(uid.value))
      return hasAdmin(uid.value)
    })

    /* function deleteAttachment () {
      const storage = firebase.storage()
      // Create a reference to the file to delete
      const desertRef = storage.ref().child(props.asset.fullPath)

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
    } */

    return { crudActions, toggleInfo, toDisplayString }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-typography.sass

.assetListItem
  display: flex
  flex-wrap: wrap
  .spacer
    flex-grow: 1
  &:hover
    background-color: var(--chroma-secondary-i)
  .preview
    width: 128px
    margin-right: 8px
    img
      max-width: 128px
      max-height: 72px
  .filedata
    width: 100%
    margin-bottom: 16px
    p
      @include TypeCaption()
      line-height: 24px

</style>
