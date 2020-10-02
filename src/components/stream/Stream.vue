<template>
  <div class="stream">
      <div v-for="(post) in posts" v-bind:key="post.postid">
        <div v-if="post.content">
          <StreamPost
            :created ="post.created"
            :topic="post.topic"
            :author="post.author"
            :content="post.content"
            :postid="post.postid" />
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, onUnmounted, computed } from 'vue'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import StreamPost from './StreamPost.vue'

export interface Post {
  author: string;
  content: string;
  created: number;
  postid: string;
  topic?: string;
}

interface PostData {
  created: {
    seconds: number;
  };
}

export default defineComponent({
  components: {
    StreamPost
  },
  props: {
    topic: {
      type: String,
      required: false
    }
  },
  setup (props) {
    // The array that holds current contents of the list
    const latestPostsTypes: Post[] = []
    const latestPosts = ref(latestPostsTypes)

    // unsubscribe to the Firebase onSnapshot listener
    let unsubscribe = () => {}

    /**
     * patches a post to the Stream
     */
    function addPostToStream (postid: string, data: object) {
      const post: Post = data as Post
      post.postid = postid
      const { created } = (data as PostData)
      post.created = created?.seconds
      latestPosts.value.push(post)
      latestPosts.value = latestPosts.value.sort((a, b) => (typeof a.created === 'undefined' ? -1 : b.created - a.created))
    }

    /**
     * patches a post to the Stream
     */
    function removePostFromStream (postid: string) {
      const arr = latestPosts.value.filter((post) => (post.postid !== postid))
      latestPosts.value = [...arr]
    }

    const capitalize = (s: string) => {
      return s.charAt(0).toUpperCase() + s.slice(1)
    }

    /**
     * subscribe to a topic from firebase
     */
    function subscribe (topic?: string) {
      // Just in case this gets called while listening to another stream
      unsubscribe()

      // Firebase references
      const db = firebase.firestore()
      const streamRef = db.collection('stream')

      if (!topic) {
        unsubscribe = streamRef.orderBy('created', 'desc').limit(11).onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') addPostToStream(change.doc.id, change.doc.data())
            if (change.type === 'removed') removePostFromStream(change.doc.id)
          })
        })
      } else {
        console.log('topic ==', capitalize(topic))
        unsubscribe = streamRef.where('topic', '==', capitalize(topic)).orderBy('created', 'desc').onSnapshot((snapshot) => {
          console.log('we got some?', snapshot.size)
          snapshot.docChanges().forEach((change) => {
            console.log('and this is ', change.doc.id)
            if (change.type === 'added') addPostToStream(change.doc.id, change.doc.data())
            if (change.type === 'removed') removePostFromStream(change.doc.id)
          })
        })
      }
    }

    onMounted(() => {
      subscribe(props.topic)
      /* const db = firebase.firestore()
      const streamRef = db.collection('stream')
      unsubscribe = streamRef.orderBy('created', 'desc').limit(11).onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          let hasPost = false
          latestPosts.value.forEach((post) => {
            if (post.postid === change.doc.id) {
              hasPost = true
              post.content = change.doc.data()?.content
            }
          })
          if (!hasPost) {
            latestPosts.value.push({
              author: change.doc.data()?.author as string,
              content: change.doc.data()?.content as string,
              created: change.doc.data().created.seconds as number,
              postid: change.doc.id,
              topic: change.doc.data().topic
            })
          }
        })
      }) */
    })
    onUnmounted(() => { unsubscribe() })

    const posts = computed(() => (latestPosts.value))
    return { posts }
  }
})
</script>
