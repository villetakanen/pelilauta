<template>
  <ViewHeader>
    {{ $t('mekanismi.title') }}
  </ViewHeader>
  <div class="contentGrid">
    <PageToolbar :title="routeSiteid + ' / ' + routePageid " />
    <MaterialCard>
      <div
        :innerHTML="pageContent"
      />
    </MaterialCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue'
import ViewHeader from '@/components/app/ViewHeader.vue'
import { useRoute } from 'vue-router'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/analytics'
import MaterialCard from '@/components/material/MaterialCard.vue'
import PageToolbar from '@/components/wikipage/PageToolbar.vue'

export default defineComponent({
  name: 'WikiIndex',
  components: {
    ViewHeader,
    PageToolbar,
    MaterialCard
  },
  setup () {
    const pageContent = ref('...')

    const route = useRoute()
    const routePageid = computed(() => {
      return Array.isArray(route.params.pageid) ? route.params.pageid[0] : route.params.pageid
    })
    const routeSiteid = computed(() => {
      return Array.isArray(route.params.siteid) ? route.params.siteid[0] : route.params.siteid
    })

    let unsubscribe = () => {
    }

    function fetchPage () {
      unsubscribe()
      const db = firebase.firestore()
      const pageRef = db.collection('sites').doc(routeSiteid.value).collection('pages').doc(routePageid.value)
      unsubscribe = pageRef.onSnapshot((snap) => {
        if (snap.exists) {
          pageContent.value = snap.data()?.htmlContent
        }
      })
    }

    onMounted(() => {
      fetchPage()
    })

    onUnmounted(() => {
      unsubscribe()
    })

    return { pageContent, routePageid, routeSiteid }
  }
})
</script>
