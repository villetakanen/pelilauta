<template>
  <div class="threadCardHeader">
    <div
      v-if="thread.site"
      class="toolbar withSite"
      :class="{ ddColors: site && site.systemBadge === 'dd'}"
    >
      <div
        class="systenBadgeFrame"
      >
        <transition name="fade">
          <Icon
            v-if="site"
            class="badge"
            :name="site.systemBadge+'-logo'"
            headline
          />
        </transition>
        <transition name="fade">
          <Icon
            v-if="!site"
            class="badge"
            name="pelilauta"
            headline
          />
        </transition>
      </div>
      <div class="titleFrame">
        <h1 class="siteinfo">
          <router-link
            v-if="site"
            :to="`/site/${site.id}`"
          >
            {{ site.name }}
          </router-link>
          <span v-else>
            {{ thread.site }}&nbsp;
          </span>
        </h1>
        <h1 class="title">
          <router-link :to="`/thread/${thread.id}/view`">
            {{ thread.data.title }}
          </router-link>
        </h1>
      </div>
    </div>
    <template v-else>
      <h1
        class="title"
        style="margin-bottom: 8px"
      >
        <router-link :to="`/thread/${thread.id}/view`">
          {{ thread.data.title }}
        </router-link>
      </h1>
    </template>
  </div>
</template>

<script lang="ts">
import Icon from '@/components/material/Icon.vue'
import { useSites } from '@/state/sites'
import { Thread } from '@/utils/firestoreInterfaces'
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  components: { Icon },
  props: {
    thread: {
      type: Object as PropType<Thread>,
      required: true
    }
  },
  setup (props) {
    const { allSites } = useSites()
    const site = computed(() => {
      if (!props.thread.site) return undefined
      return allSites.value.find((site) => (site.id === props.thread.site))
    })
    return { site }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-typography.sass
h1.title
  margin-bottom: 0
.siteinfo
  @include TypeCaption()
.systenBadgeFrame
  height: 48px
  width: 52px
  flex-grow: 0
  position: relative
  .badge
    position: absolute
    top: 0
    left: -4px
.titleFrame
  flex-grow: 1
a, h1.title a
  color: var(--chroma-secondary-b)
.withSite
  background-color: #{'rgba(var(--chroma-primary-c-rgba), 0.22)'}
  margin-top: -16px
  padding-top: 8px
  padding-bottom: 8px
  margin-left: -16px
  padding-left: 16px
  margin-right: -16px
  padding-right: 16px
  margin-bottom: 8px
  border-radius: 12px 12px 0 0
  a
    color: var(--chroma-primary-c)
  h1.title a
    color: var(--chroma-secondary-c)
.ddColors
  background: linear-gradient(160deg, rgba(188,15,15,.05) 0%, rgba(188,15,15,.25) 92%)
  a
    color: rgba(188,15,15,1)
  h1.title a
    color: rgba(96,7,7,1)
</style>
