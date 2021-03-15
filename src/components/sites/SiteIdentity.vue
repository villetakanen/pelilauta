<template>
  <Card class="siteIdentity contentArea">
    <h2>{{ $t('mekanismi.site.identity') }}</h2>
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
      :label="$t('mekanismi.splashImage')"
      :opts="opts"
    />
    <div style="word-break: break-all; font-size:8pt; opacity: 0.5">
      {{ site }}
    </div>
  </Card>
</template>
<script lang="ts">
import { computed, ComputedRef, defineComponent, inject } from 'vue'
import { Site, SiteData, updateSite, useFiles } from '@/state/site'
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
    const { files } = useFiles()
    const opts = computed(() => (files.value.map((val) => ({ key: val[1], value: val[0] }))))
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
  right: 0px
  top: 16px
  height: 72px
  width: 72px
  // border: solid 2px rgba($color-fill-primary-light, 0.22)
  border-radius: 36px
  background-size: cover
  @include BoxShadow8()

</style>
