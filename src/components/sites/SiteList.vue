<template>
  <Column class="siteList double">
    <section>
      <div class="toolbar">
        <h4 style="margin:0; padding-left: 12px">
          <Icon
            name="filter"
          /><span class="hideOnMobile">{{ $t('sort.title') }}</span>
        </h4>
        <div class="spacer" />
        <Button
          text
          @click="sort='date'"
        >
          {{ $t('sort.byDate') }}
        </Button>
        <Button
          text
          @click="sort='name'"
        >
          {{ $t('sort.byName') }}
        </Button>
      </div>
    </section>
    <Card
      v-for="site in publicSites"
      :key="site.id"
      :rise="2"
      class="siteCard"
      :class="{ withPoster: site.splashURL }"
    >
      <img
        v-if="site.splashURL"
        alt=""
        :src="site.splashURL"
        class="poster"
      >
      <h1>
        <router-link :to="`/site/${site.id}`">
          {{ site.name }}
        </router-link>
      </h1>

      <p class="description">
        {{ site.description }}
      </p>

      <Toolbar class="cardBottom">
        <Icon
          v-if="site.systemBadge"
          :name="site.systemBadge + '-logo'"
          class="systemBadge"
        />
        <SpacerDiv />
        <div class="caption">
          {{ toDisplayString(site.lastUpdate || null) }}
        </div>
      </Toolbar>
    </Card>
  </Column>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, ref } from 'vue'
import Card from '@/components/layout/Card.vue'
import { fireStoreURL, toDisplayString } from '@/utils/firebaseTools'
import Icon from '../material/Icon.vue'
import { useSites } from '@/state/sites'
import { Site } from '@/state/site'
import Column from '../layout/Column.vue'
import { useAuth } from '@/state/authz'
import Button from '../form/Button.vue'
import Toolbar from '../layout/Toolbar.vue'

export default defineComponent({
  name: 'SiteList',
  components: {
    Card,
    Icon,
    Column,
    Button,
    Toolbar
  },
  props: {
    filter: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup (props) {
    const { allSites } = useSites()
    const { user } = useAuth()
    const sort = ref('date')

    const mySites = computed(() => (
      allSites.value.filter((val) => (
        !val.hidden ||
        (Array.isArray(val.owners) && val.owners.includes(user.value.uid)) ||
        (Array.isArray(val.players) && val.players.includes(user.value.uid))
      )).sort((a, b) => {
        if (sort.value === 'name') {
          return a.name > b.name ? 1 : -1
        }
        if (sort.value === 'date') {
          return (a.lastUpdate?.seconds || 0) < (b.lastUpdate?.seconds || 0) ? 1 : -1
        }
        return -1
      })
    ))

    const publicSites:ComputedRef<Array<Site>> = computed(() => {
      if (props.filter) {
        return mySites.value.filter((site) => (site.systemBadge === props.filter)) || new Array<Site>()
      }
      return mySites.value
    })

    return { publicSites, fireStoreURL, toDisplayString, sort }
  }
})
</script>

<style lang="sass">
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

section.siteCard
  position: relative
  h1
    @include TypeHeadline5()
    line-height: 36px
    padding: 0
    margin: 0
    margin-bottom: 12px
    a
      color: var(--chroma-secondary-d)
  p
    @include TypeBody2()
    margin: 0
    padding: 0
    margin-bottom: 12px
    font-style: italic
  img.poster
    max-height: 72px
    max-width: 144px
    border-radius: 6px
    position: absolute
    top: 16px
    right: 16px
  &.withPoster
    h1, p
      padding-right: calc(144px + 16px)
  .cardBottom
    margin: 0
    @include TypeCaption()

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
