<template>
  <div>
    <!-- MaterialButton>{{ $t('action.createSite') }}</MaterialButton -->
    <MaterialCard
      v-for="site in sites"
      :key="site.id"
    >
      <h3> {{ site.name }} </h3>
      <p>{{ site.description }}</p>
      <p><a :href="'https://mekanismi.web.app/#/v/'+site.id">{{ 'mekanismi.web.app/#/v/'+site.id }}</a></p>
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

interface Site {
  id: string;
  name?: string;
  description?: string;
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
        console.log(snap.size)
        snap.docChanges().forEach((change) => {
          console.log(change)
          sites.value.push({ id: change.doc.id, ...change.doc.data() })
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

    return { sites }
  }
})
</script>
