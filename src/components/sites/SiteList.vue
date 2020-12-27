<template>
  <div>
    <!-- MaterialButton>{{ $t('action.createSite') }}</MaterialButton -->
    <MaterialCard
      v-for="site in sites"
      :key="site.id"
      class="siteCard"
    >
      <div
        v-if="site.posterURL"
        :style="`background-image: url(${site.posterURL})`"
        class="poster"
      />
      <h3>
        <router-link :to="`/mekanismi/view/${site.id}/${site.id}`">
          {{ site.name }}
        </router-link>
      </h3>
      <p>{{ site.description }}</p>
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
div.material-card.siteCard
  h3
    a
      color: rgba(0, 121, 107, 1)
  .poster
    height: 72px
    width: 72px
    float: right
    border-radius: 36px
    background-size: cover
    box-shadow: 0px 0px 14px 0px rgba(0, 121, 107, 0.7)
</style>
