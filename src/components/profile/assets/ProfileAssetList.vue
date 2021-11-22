<template>
  <main class="profileAssetList emptyLayout">
    <Column>
      <Loader v-if="loading" />
      <template v-else>
        <CollectionEmptyPane
          v-if="!assets.size"
          icon="attachments"
          :message="$t('assets.collection.empty.message')"
          :title="$t('assets.collection.empty.title')"
        >
          <UploadAssetButton text />
        </CollectionEmptyPane>
        <div
          v-else
          class="flexList"
        >
          <ProfileAssetItem
            v-for="asset in assets"
            :id="asset[0]"
            :key="asset[0]"
          />
        </div>
      </template>
    </Column>
  </main>
</template>

<script lang="ts">
import Loader from '@/components/app/Loader.vue'
import UploadAssetButton from '@/components/assets/UploadAssetButton.vue'
import Column from '@/components/layout/Column.vue'
import CollectionEmptyPane from '@/components/material3/CollectionEmptyPane.vue'
import { useAssets } from '@/state/assets'
import { defineComponent } from 'vue'
import ProfileAssetItem from './ProfileAssetItem.vue'

export default defineComponent({
  name: 'ProfileAssetList',
  components: { ProfileAssetItem, Loader, CollectionEmptyPane, UploadAssetButton, Column },
  setup () {
    const { assets, loading } = useAssets()
    return { assets, loading }
  }
})
</script>

<style lang="sass" scoped>
.assetList
  margin-top: 12px
  margin-bottom: 12px
</style>
