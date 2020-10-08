<template>
  <h3>Editor...</h3>
  <p>This page does not work properly yet!</p>
  <p>It's intentional!</p>
  <MaterialCard>
    <h3>{{ title }}</h3>
    <transition name="fade">
      <Editor
        v-if="content"
        v-model="content"
      />
    </transition>
    <div
      v-if="content"
      class="toolbar"
    >
      <div class="spacer" />
      <MaterialButton text>
        Cancel
      </MaterialButton>
      <MaterialButton>Save</MaterialButton>
    </div>
  </MaterialCard>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import Editor from '@/components/editor/Editor.vue'
import { useStream } from '@/lib/stream'

export default defineComponent({
  name: 'EditPost',
  components: {
    MaterialCard,
    MaterialButton,
    Editor
  },
  props: {
    postid: {
      type: String,
      required: false,
      default: '_new-post'
    }
  },
  setup (props) {
    const { getPost } = useStream()
    const content = ref('')
    const title = ref('')
    getPost(props.postid).then((post) => {
      if (post) {
        content.value = post.content
        title.value = post.title
      }
    })
    return { content, title }
  }
})
</script>
