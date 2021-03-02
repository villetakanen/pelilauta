<template>
  <div class="cardGrid">
    <MaterialCard
      v-for="site in publicSites"
      :key="site.id"
      class="siteCard"
    >
      <div
        v-if="site.splashURL"
        :style="`background-image: url(${site.splashURL})`"
        class="splash"
      />
      <div
        v-if="site.splashURL"
        class="siteCardThemePosterBlur"
      />
      <div
        v-if="site.splashURL"
        :style="`background-image: url(${site.splashURL})`"
        class="poster"
      />
      <div style="z-index: 11; position: relative">
        <h3>
          <router-link :to="`/mekanismi/view/${site.id}/${site.id}`">
            {{ site.name }}
          </router-link>
        </h3>
        <p class="description">
          {{ site.description }}
        </p>
      </div>
      <div v-if="site.systemBadge">
        <Icon
          :name="site.systemBadge + '-logo'"
          class="systemBadge"
        />
      </div>
    </MaterialCard>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import { fireStoreURL } from '@/utils/firebaseTools'
import Icon from '../material/Icon.vue'
import { useSites } from '@/state/sites'

export default defineComponent({
  name: 'SiteList',
  components: {
    MaterialCard,
    Icon
  },
  setup () {
    const { publicSites } = useSites()

    return { publicSites, fireStoreURL }
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

@include media('<tablet')
  div.material-card.siteCard
    width: calc(100vw - 56px)

@include media('>=tablet')
  div.material-card.siteCard
    width: 348px

div.material-card.siteCard
  overflow: hidden
  position: relative
  flex-grow: 0
  flex-shrink: 0
  .description
    max-height: 72px
    overflow: hidden
  h3
    a
      color: rgba(0, 121, 107, 1)
  .poster
    height: 72px
    width: 72px
    position: absolute
    top: 16px
    right: 16px
    border-radius: 36px
    background-size: cover
    box-shadow: 0px 0px 14px 0px rgba(0, 121, 107, 0.7)
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
