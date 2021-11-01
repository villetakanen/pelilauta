<template>
  <section class="forumsAd chroma-box-1">
    <div class="splashHeader">
      <img src="https://firebasestorage.googleapis.com/v0/b/skaldbase.appspot.com/o/mekanismi%2FSMzqHwOd.jpeg?alt=media&token=42a12429-f5c0-47b5-bad1-0031d0b4aecc">
      <h1>
        <router-link to="/threads/Yleinen">
          {{ $t('calltoaction.forum.title') }}
        </router-link>
      </h1>
    </div>
    <div class="buttons">
      <Button
        v-for="channel in streams"
        :key="channel.slug"
        text
        dark
        @click="reroute('/threads/'+channel.slug)"
      >
        {{ channel.name }} <span class="count">{{ channel.count }}</span>
      </Button>
    </div>
    <div class="icon">
      <Icon
        name="pelilauta"
        dark
        headline
      />
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useMeta } from '@/state/meta'
import Button from '@/components/form/Button.vue'
import Icon from '@/components/material/Icon.vue'
import { useUxActions } from '@/composables/useUxActions'

export default defineComponent({
  name: 'ForumsAd',
  components: { Button, Icon },
  setup () {
    const { streams: streamsRaw } = useMeta()
    const { reroute } = useUxActions()
    const streams = computed(() => (streamsRaw.value.filter((c) => (c.slug !== '-'))))
    return { streams, reroute }
  }
})
</script>
<style lang="sass" scoped>
@import @/styles/material-typography.sass
@import @/styles/include-media.scss
@import @/styles/atomics.sass

.forumsAd
  .splashHeader
    position: relative
    img
      width: 100%
      pointer-events: none
    h1
      @include TypeHeadline5()
      position: absolute
      bottom: 4px
      left: 0
      margin: 0
      padding: 4px 16px
      padding-top: 16px
      text-shadow: 0px 0px 16px var(--chroma-secondary-a)
      background: linear-gradient(180deg, rgba(0, 32, 30, 0) 0%, var(--chroma-secondary-a) 100%)
      width: calc(100% - 32px)
  p
    margin: 16px
    color: var(--chroma-secondary-g)
  .buttons
    text-align: center
    margin: 0
    padding: 8px 16px
  .count
    @include TypeCaption()
    display: inline-block
    background-color: rgba(255, 255, 255, 0.172)
    padding: 2px 8px
    border-radius: 12px
    margin-left: 4px
    margin-right: -4px
  div.icon
    margin: 0 auto
    text-align: center
    margin-bottom: 16px

</style>
