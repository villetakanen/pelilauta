<template>
  <div class="errorView">
    <Header>
      <ViewTitle icon="lightbulb">
        {{ $t('errorPage.notFound') }}
      </ViewTitle>
    </Header>
    <MaterialCard class="errorCard">
      <h1>:/</h1>
      <p>{{ $t('errorPage.message') }}</p>
      <Toolbar>
        <div class="spacer" />
        <Button
          text
          @click="reroute('/')"
        >
          {{ $t('siteInfo.title') }}
        </Button>
      </Toolbar>
    </MaterialCard>
    <div class="pageAttentionPic" />
  </div>
</template>

<script lang="ts">
import Button from '@/components/form/Button.vue'
import Header from '@/components/layout/Header.vue'
import Toolbar from '@/components/layout/Toolbar.vue'
import ViewTitle from '@/components/layout/ViewTitle.vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import { useUxActions } from '@/composables/useUxActions'
import { getAnalytics, logEvent } from '@firebase/analytics'
import { defineComponent, onMounted } from 'vue'

export default defineComponent({
  name: '404',
  components: { Toolbar, MaterialCard, Header, ViewTitle, Button },
  setup () {
    const a = getAnalytics()
    const { reroute } = useUxActions()
    onMounted(() => { logEvent(a, 'PageView', { name: '404' }) })
    return { reroute }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.errorCard
  width: 40%
  margin-left: 50%

.errorView
  position: relative
  .pageAttentionPic
    z-index: -1
    position: fixed
    bottom: 0
    left: 22%
    height: calc(80vh)
    width: calc(33vw)
    background-repeat: no-repeat
    background-position: bottom
    background-image: url('/src/404-element.svg')

@include media('<tablet')
  .errorCard
    width: calc(100% - 48px)
    margin-left: 8px
    margin-right: 8px
    opacity: 0.77
    backdrop-filter: blur(1px)
  .errorView
    position: relative
    .pageAttentionPic
      opacity: 1
      position: fixed
      bottom: 0
      left: 16px
      height: calc(80vh)
      width: calc(80vw)
      background-repeat: no-repeat
      background-position: bottom
      background-image: url('/src/404-element.svg')

</style>
