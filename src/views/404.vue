<template>
  <div class="errorView">
    <Toolbar>
      <h3>{{ $t('errorPage.notFound') }}</h3>
    </Toolbar>
    <MaterialCard class="errorCard">
      <h1>:/</h1>
      <p>{{ $t('errorPage.message') }}</p>
      <Toolbar>
        <div class="spacer" />
        <MaterialButton
          text
          to="/"
        >
          {{ $t('siteInfo.title') }}
        </MaterialButton>
      </Toolbar>
    </MaterialCard>
    <div class="pageAttentionPic" />
  </div>
</template>

<script lang="ts">
import Toolbar from '@/components/layout/Toolbar.vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import { defineComponent, onMounted } from 'vue'
import firebase from 'firebase/app'
import 'firebase/analytics'

export default defineComponent({
  name: '404',
  components: { Toolbar, MaterialCard, MaterialButton },
  setup () {
    onMounted(() => { firebase.analytics().logEvent('PageView', { name: '404' }) })
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
