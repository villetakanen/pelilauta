<template>
  <Card class="SiteCard">
    <div
      v-if="site.theme.avatarImageURL"
      class="avatar"
    >
      <img
        class="avatar-image"
        :src="site.theme.avatarImageURL"
        :alt="site.name + ' avatar'"
      >
      <Icon
        :name="site.system + '-logo'"
        class="withAvatar"
      />
    </div>
    <div
      v-else
      class="avatar"
    >
      <Icon :name="site.system + '-logo'" />
    </div>
    <h1>
      <router-link :to="`/site/${site.id}`">
        {{ site.name }}
      </router-link>
    </h1>
    <p style="clear:both">
      {{ site.description }}
    </p>
    <p class="TypeCaption">
      {{ $t('meta.updatedAt') }} {{ toDisplayString(site.updatedAt) }}
    </p>
  </Card>
</template>

<script lang="ts">
import Card from '@/components/layout/Card.vue'
import Icon from '@/components/material/Icon.vue'
import { Site } from '@/state/site/Site'
import { useSites } from '@/state/sites'
import { computed, defineComponent } from 'vue'
import { toDisplayString } from '@/utils/firebaseTools'

export default defineComponent({
  components: { Card, Icon },
  props: {
    siteid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { allSites } = useSites()
    const site = computed(() => {
      return allSites.value.find(s => s.id === props.siteid) || new Site(props.siteid)
    })
    return { site, toDisplayString }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss

.avatar
  position: relative
  float: right
.avatar-image
  height: 96px
  width: 96px
  border-radius: 50%
.withAvatar
  position: absolute
  bottom: 0
  right: 0
  margin: 0 !important
  padding: 0 !important
  display: block
  filter: drop-shadow( 0px 0px 4px var(--chroma-secondary-f))

@include media('>=tablet')
  .SiteCard
    width: calc(50% - 40px)

</style>
