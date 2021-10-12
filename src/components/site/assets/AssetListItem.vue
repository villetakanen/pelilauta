<template>
  <div class="assetListItem">
    <div class="assetData">
      <!-- thumbnail preview of the asset -->
      <div class="preview">
        <a :href="asset.url">
          <img
            :src="asset.url"
            alt="click to preview"
          >
        </a>
      </div>

      <div class="name contentBox">
        <p>{{ asset.name }}</p>
      </div>
      <div class="actions">
        <MaterialButton
          icon
          @click="toggleInfo = !toggleInfo"
        >
          <Icon name="about" />
        </MaterialButton>
        <MaterialButton
          icon
          :disabled="!crudActions"
          @click="drop"
        >
          <Icon name="remove" />
        </MaterialButton>
      </div>
    </div>
    <div
      v-if="toggleInfo"
      class="filedata contentBox"
    >
      <p>{{ author }}</p>
      <p>{{ toDisplayString(asset.lastUpdate) }}</p>
      <p>{{ asset.url }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { useAuth } from '@/state/authz'
import { useSite } from '@/state/site'
import { computed, defineComponent, PropType, ref } from 'vue'
import MaterialButton from '../../material/MaterialButton.vue'
import Icon from '@/components/material/Icon.vue'
import { deleteAsset } from '@/state/site/assets'
import { toDisplayString } from '@/utils/firebaseTools'
import { useSnack } from '@/composables/useSnack'
import { useAuthors } from '@/state/authors'
import { Asset } from '@/utils/firestoreInterfaces'

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
  setup (props) {
    const toggleInfo = ref(false)
    const { pushSnack } = useSnack()
    const { authors } = useAuthors()
    const author = computed(() => authors.value.find((a) => (a.uid === props.asset.creator))?.nick || '-')

    const crudActions = computed(() => {
      const { hasAdmin } = useSite()
      const { user } = useAuth()
      return hasAdmin(user.value.uid)
    })

    async function drop () {
      try {
        await deleteAsset(props.asset.name)
        pushSnack('asset deleted')
      } catch (error) {
        console.error(error)
        pushSnack('asset deletion failed')
      }
    }

    return { crudActions, toggleInfo, toDisplayString, drop, author }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-typography.sass
@import @/styles/box-shadow.sass

.assetListItem
  @include Rise1()
  .assetData
    .preview
      img
        max-width: 100%
        max-height: 256px

@include media('>=tablet')
  .assetListItem
    max-width: 310px

.assetData
  .actions
    width: 144px
    flex-shrink: 0
  .name
    flex-grow: 1
  &:hover
    background-color: var(--chroma-secondary-i)

.filedata
  width: 100%
  margin-bottom: 16px
  p
    @include TypeCaption()
    line-height: 24px

</style>
