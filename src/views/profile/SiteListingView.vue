<template>
  <div class="profileSites">
    <ProfileToolbar />
    <div class="singleColumnLayout">
      <div class="siteGrid">
        <template
          v-for="site in mySites"
          :key="site.id"
          class="siteGrid"
        >
          <div
            class="siteCell siteTitle"
            :class="{hidden: site.hidden}"
          >
            <router-link :to="`/mekanismi/view/${site.id}/${site.id}`">
              {{ site.name }}
            </router-link>
          </div>
          <div class="siteCell siteBadge">
            <Icon
              v-if="site.hidden"
              name="hidden"
              style="opacity: 0.22"
              x-small
            />
            <Icon
              v-else
              :name="site.systemBadge + '-logo'"
              x-small
            />
          </div>
          <div
            class="siteCell siteDescription"
            :class="{hidden: site.hidden}"
          >
            {{ site.description }}
            <br>
            <span class="caption">{{ toDisplayString(site.lastUpdate) }}</span>
          </div>
        </template>
      </div>
    </div>
    <teleport to="#ScreenBottomFloatRight">
      <ToTopFab />
    </teleport>
  </div>
</template>

<script lang="ts">
import { useAuth, useProfile } from '@/state/authz'
import { useSites } from '@/state/sites'
import { computed, defineComponent } from 'vue'
import { toDisplayString } from '@/utils/firebaseTools'
import Icon from '@/components/material/Icon.vue'
import ProfileToolbar from '@/components/profile/ProfileToolbar.vue'
import ToTopFab from '@/components/app/ToTopFab.vue'

export default defineComponent({
  components: { Icon, ProfileToolbar, ToTopFab },
  setup () {
    const { user } = useAuth()
    const { profile } = useProfile()
    const { allSites } = useSites()
    const mySites = computed(() => (allSites.value.filter((val) => (Array.isArray(val.owners)) && val.owners.includes(user.value.uid))))
    return { profile, mySites, toDisplayString }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass
@import @/styles/include-media.scss

.siteGrid
  display: grid
  grid-template-columns: auto auto 1fr
  grid-gap: 8px
  margin-bottom: 16px
  a
    text-decoration: none
  div.hidden
    opacity: 0.44
    font-style: italic
  .caption
    @include TypeCaption()

@include media('<tablet')
  .siteGrid
    padding: 8px
    display: flex
    flex-wrap: wrap
    .siteTitle
      width: 100%
      flex: none
      @include TypeHeadline6()
      border-bottom: solid 1px var(--chroma-primary-f)
      &.hidden
        opacity: 1
        color: var(--chroma-secondary-b)
        border-bottom: dashed 1px var(--chroma-secondary-h)
        a
          color: var(--chroma-secondary-b)
    .siteBadge
      width: 22px
    .siteDescription
      width: calc( 100% -  30px)
      margin-bottom: 16px
</style>
