<template>
  <MaterialCard class="about">
    <div :innerHTML="aboutContent" />
    <div class="origin">
      <a href="https://mekanismi.web.app/">https://mekanismi.web.app/</a>
    </div>
  </MaterialCard>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import firebase from 'firebase/app'
import 'firebase/firestore'

export default defineComponent({
  name: 'About',
  components: {
    MaterialCard
  },
  setup () {
    const aboutContent = ref('...')
    onMounted(() => {
      document.title = 'Pelilauta - About'
      const db = firebase.firestore()
      const aboutRef = db.collection('sites').doc('mekanismi').collection('pages').doc('pelilauta-about')
      aboutRef.get().then((doc) => {
        aboutContent.value = doc.data()?.htmlContent
      })
    })
    return { aboutContent }
  }
})
</script>
