<template>
  <MaterialCard class="stream-post">
    <transition name="fade">
      <div v-if="photoURL" class="avatar">
        <img :src="photoURL" :alt="nick"/>
      </div>
    </transition>
    <div :innerHTML="content"></div>
    <p class="caption">{{nick}}</p>
  </MaterialCard>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import * as firebase from 'firebase/app'
import 'firebase/auth'

export default defineComponent({
  components: {
    MaterialCard
  },
  props: {
    content: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const nick = ref('')
    const photoURL = ref('')
    onMounted(() => {
      const db = firebase.firestore()
      const authorRef = db.collection('profiles').doc(props.author)
      authorRef.get().then((doc) => {
        if (doc.exists) {
          nick.value = doc.data()?.nick
          photoURL.value = doc.data()?.photoURL
        }
      })
    })
    return { nick, photoURL }
  }
})
</script>
