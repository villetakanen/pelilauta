<template>
  <main class="profileAssetList flexLayout">
    <ProfileAssetItem
      v-for="asset in assets"
      :id="asset[0]"
      :key="asset[0]"
    />
  </main>
</template>

<script lang="ts">
import { useAssets } from '@/state/assets'
import { defineComponent } from 'vue'
import ProfileAssetItem from './ProfileAssetItem.vue'

export default defineComponent({
  name: 'ProfileAssetList',
  components: { ProfileAssetItem },
  setup () {
    const { assets } = useAssets()
    console.log(assets.value)
    return { assets }
  }
})
</script>

<style lang="sass" scoped>
.assetList
  margin-top: 12px
  margin-bottom: 12px
</style>
