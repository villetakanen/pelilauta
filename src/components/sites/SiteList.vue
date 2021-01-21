<template>
  <div>
    <!-- MaterialButton>{{ $t('action.createSite') }}</MaterialButton -->
    <MaterialCard
      v-for="site in sites"
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
      <div
        v-else-if="site.posterURL"
        :style="`background-image: url(${site.posterURL})`"
        class="poster"
      />
      <div style="z-index: 11; position: relative">
        <h3>
          <router-link :to="`/mekanismi/view/${site.id}/${site.id}`">
            {{ site.name }}
          </router-link>
        </h3>
        <p>{{ site.description }}</p>
      </div>
      <!--p><a :href="'https://mekanismi.web.app/#/v/'+site.id">{{ 'mekanismi.web.app/#/v/'+site.id }}</a></p-->
    </MaterialCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, Ref } from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'
// import MaterialButton from '@/components/material/MaterialButton.vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import { fireStoreURL } from '@/utils/firebaseTools'

interface Site {
  id: string,
  name?: string,
  description?: string,
  posterURL?: string
}

export default defineComponent({
  name: 'SiteList',
  components: {
    // MaterialButton,
    MaterialCard
  },
  setup () {
    const sites:Ref<Site[]> = ref([])

    let unsubscribe = () => {}

    async function subscribeToSites () {
      unsubscribe()
      const db = firebase.firestore()
      unsubscribe = db.collection('sites').where('hidden', '==', false).orderBy('lastUpdate', 'desc').onSnapshot((snap) => {
        // console.log(snap.size)
        snap.docChanges().forEach((change) => {
          // console.log(change)
          sites.value.push({ id: change.doc.id, ...change.doc.data() })
          if (change.doc.data().posterURL) {
            fireStoreURL(change.doc.id + '/' + change.doc.data().posterURL).then((url) => {
              sites.value.forEach((site) => {
                if (site.id === change.doc.id) site.posterURL = url
              })
            })
          }
        })
      })
    }

    subscribeToSites()
    onMounted(() => {
      subscribeToSites()
    })

    onUnmounted(() => {
      unsubscribe()
    })

    return { sites, fireStoreURL }
  }
})
</script>

<style lang="sass">
@import @/styles/include-media.scss
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

div.material-card.siteCard
  overflow: hidden
  position: relative
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
    height: 240px
    width: 480px
    position: absolute
    top: -97px
    right: -16px
    background-size: cover
    pointer-events: none
    opacity: 0.4
  .siteCardThemePosterBlur
    height: 200px
    width: 480px
    position: absolute
    top: -16px
    right: -16px
    background: linear-gradient(101deg, rgba($color-fill-light,1) 8%, rgba($color-fill-primary-light, 0.2) 44%, rgba($color-fill-primary, 0.2) 64%, rgba($color-fill-primary-dark, 0.1) 100%)

</style>
