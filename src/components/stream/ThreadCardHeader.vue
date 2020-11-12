<template>
  <div>
    <h1>{{ thread.data.title }}</h1>
    <p>
      <span v-if="author">{{ author.nick }}</span>&nbsp;<span v-if="since">{{ since }}</span>
    </p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { Thread } from '@/state/threads'
import { useAuthors } from '@/lib/authors'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { useI18n } from 'vue-i18n'
// import MaterialCard from '@/components/material/MaterialCard.vue'

export default defineComponent({
  name: 'ThreadCardHeader',
  props: {
    thread: {
      type: Object as () => Thread,
      required: true
    }
  },
  setup (props) {
    const { authors } = useAuthors()
    const author = computed(() => (authors.value.find((val) => (val.uid === props.thread.author))))

    const i18n = useI18n()
    // @todo: extract to /utils
    function toSince (timestamp: firebase.firestore.Timestamp) {
      const date = new Date(timestamp.seconds * 1000 + 10800000)
      const now = new Date()
      const diff = (now.getTime() - date.getTime()) / 1000 / 60
      let s = ''
      if (diff < 30) s = i18n.t('since.lessThanHalfh')
      else if (diff < 120) s = i18n.t('since.lessThanTwoHours')
      else if (diff < 1440) s = i18n.t('since.lessThan24h')
      else s = date.toISOString().substring(0, 10) + ', ' + date.toISOString().substring(11, 16)
      return s
    }

    const since = computed(() => (toSince(props.thread.created)))
    return { author, since }
  }
})
</script>
