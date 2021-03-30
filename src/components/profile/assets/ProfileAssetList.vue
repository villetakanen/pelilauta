<template>
  <div class="profileAssetList">
    <h3>{{ $t('profile.asset.list.title') }}</h3>
    <div class="assetList">
      <ProfileAssetItem
        v-for="asset, key in assets"
        :key="key"
        :asset="asset[1]"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { useAssets } from '@/state/authz'
import { defineComponent } from 'vue'
import ProfileAssetItem from './ProfileAssetItem.vue'

export default defineComponent({
  name: 'ProfileAssetList',
  components: { ProfileAssetItem },
  setup () {
    const { assets } = useAssets()
    return { assets }
  }
})
</script>

<style lang="sass" scoped>
.assetList
  margin-top: 12px
  margin-bottom: 12px
</style>
