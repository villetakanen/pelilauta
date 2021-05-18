<template>
  <Card class="siteIdentity contentArea contentBox">
    <h2>{{ $t('wiki.meta.identity') }}</h2>
    <div
      v-if="site.splashURL"
      style="position:relative"
    >
      <div
        class="previewAvatar"
        alt="previewAvatar"
        :style="`background-image: url(${site.splashURL}`"
      />
      <img
        v-if="site.splashURL"
        class="cardPoster"
        alt="Site splash image"
        :src="site.splashURL"
      >
    </div>
    <MaterialSelect
      v-model="selected"
      :label="$t('site.meta.splashImage')"
      :opts="opts"
    />
  </Card>
</template>
<script lang="ts">
import { computed, ComputedRef, defineComponent, inject } from 'vue'
import { Site, SiteData, updateSite, useAssets } from '@/state/site'
import MaterialSelect from '../material/MaterialSelect.vue'
import Card from '../layout/Card.vue'

export default defineComponent({
  name: 'SiteIdentityCard',
  components: { MaterialSelect, Card },
  setup () {
    const site = inject('site') as ComputedRef<Site>
    const selected = computed({
      get: () => (site.value.splashURL),
      set: (val) => {
        console.log(val)
        const siteFragment:SiteData = { id: site.value.id, splashURL: val }
        updateSite(siteFragment)
      }
    })
    const { assets } = useAssets()
    const opts = computed(() => Array.from(assets.value, ([key, value]) => ({ key: value.url, value: key })))
    return { site, selected, opts }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.previewAvatar
  position: absolute
  right: 16px
  top: 16px
  height: 72px
  width: 72px
  // border: solid 2px rgba($color-fill-primary-light, 0.22)
  border-radius: 36px
  background-size: cover
  @include BoxShadow8()

</style>
