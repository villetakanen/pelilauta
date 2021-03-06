<template>
  <div class="cardGrid">
    <Card
      v-for="site in publicSites"
      :key="site.id"
      :rise="2"
      class="siteCard"
    >
      <div style="z-index: 11; position: relative">
        <div
          v-if="site.splashURL"
          :style="`background-image: url(${site.splashURL})`"
          class="poster"
        />
        <div
          v-if="site.splashURL"
          class="posterFade"
        />
        <h1>
          <router-link :to="`/mekanismi/view/${site.id}/${site.id}`">
            {{ site.name }}
          </router-link>
        </h1>
        <p class="description">
          {{ site.description }}
        </p>
      </div>

      <div
        class="toolbar"
        style="clear:both"
      >
        <Icon
          v-if="site.systemBadge"
          :name="site.systemBadge + '-logo'"
          class="systemBadge"
        />
        <div class="spacer" />
        <div class="caption">
          {{ toDisplayString(site.lastUpdate || null) }}
        </div>
      </div>
    </Card>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from 'vue'
import Card from '@/components/layout/Card.vue'
import { fireStoreURL, toDisplayString } from '@/utils/firebaseTools'
import Icon from '../material/Icon.vue'
import { useSites } from '@/state/sites'
import { Site } from '@/state/site'

export default defineComponent({
  name: 'SiteList',
  components: {
    Card,
    Icon
  },
  props: {
    filter: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup (props) {
    const { publicSites: unfilteredSites } = useSites()

    const publicSites:ComputedRef<Array<Site>> = computed(() => {
      if (props.filter) {
        return unfilteredSites.value.filter((site) => (site.systemBadge === props.filter)) || new Array<Site>()
      }
      return unfilteredSites.value
    })

    return { publicSites, fireStoreURL, toDisplayString }
  }
})
</script>

<style lang="sass">
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.systemBadge
  height: 24px
  width: 24px

div.cardGrid
  display: flex
  flex-wrap: wrap
  grid-gap: 8px
  justify-content: center
  align-items: flex-start
  div.siteCard
    margin: 0

@include media('<tablet')
  div.siteCard
    width: calc(100vw - 56px)

@include media('>=tablet')
  div.siteCard
    width: 348px

div.siteCard
  overflow: hidden
  position: relative
  flex-grow: 0
  flex-shrink: 0
  .description
    overflow: hidden
    padding-top:8px
    padding-bottom: 8px
  h1
    @include TypeHeadline5()
    line-height: 24px
    margin-top: 0
    a
      color: var(--chroma-secondary-a)
  .poster
    //height: 128px
    // width: calc(100% + 32px)
    // margin: -16px
    // margin-bottom: -28px
    // background-size: cover
    background-position: center
    height: 72px
    width: 72px
    float: right
    border-radius: 36px
    background-size: cover
    box-shadow: 0px 0px 14px 0px rgba(0, 121, 107, 0.7)
    margin: 0
  .splash
    height: 320px
    width: 480px
    position: absolute
    top: -97px
    right: -16px
    background-size: cover
    pointer-events: none
    opacity: 0.22
  .siteCardThemePosterBlur
    display: none
    height: 200px
    width: 480px
    position: absolute
    top: -16px
    right: -16px
    background: linear-gradient(101deg, rgba($color-fill-light,1) 8%, rgba($color-fill-primary-light, 0.2) 44%, rgba($color-fill-primary, 0.2) 64%, rgba($color-fill-primary-dark, 0.1) 100%)

</style>
