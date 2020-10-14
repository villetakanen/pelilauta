<template>
  <MaterialCard>
    <h3>{{ title }}</h3>
    <transition name="fade">
      <div v-if="canEdit">
        <div class="toolbar">
          <div class="grow">
            <input
              v-model="title"
              class="material-textfield"
              type="text"
            >
          </div>
          <select
            v-model="topic"
            name="topic"
          >
            <option
              v-for="(t) in topics"
              :key="t.slug"
              :value="t.slug"
            >
              {{ t.title }}
            </option>
          </select>
        </div>
        <Editor
          v-if="content"
          v-model="content"
        />
      </div>
    </transition>
    <div
      v-if="content"
      class="toolbar"
    >
      <div class="spacer" />
      <MaterialButton
        text
        :action="cancel"
      >
        Cancel
      </MaterialButton>
      <MaterialButton :action="update">
        Save
      </MaterialButton>
    </div>
  </MaterialCard>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import Editor from '@/components/editor/Editor.vue'
import { useStream } from '@/lib/stream'
import { useAuthz } from '@/lib/authz'
import { useMeta } from '@/lib/meta'
import { useRouter } from 'vue-router'

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
    const { getPost, updatePost } = useStream()
    const { uid } = useAuthz()
    const { isAdmin, topics } = useMeta()
    const content = ref('')
    const title = ref('')
    const topic = ref('')
    const canEdit = ref(false)
    getPost(props.postid).then((post) => {
      if (post) {
        content.value = post.data.content
        title.value = post.data.title
        canEdit.value = isAdmin(uid.value) || uid.value === post.author
        topic.value = post.data.topic
      }
    })
    const router = useRouter()
    const update = () => {
      updatePost(props.postid, title.value, content.value, topic.value)
      router.push('/stream/view/' + props.postid)
    }
    const cancel = () => {
      router.push('/stream/view/' + props.postid)
    }
    return { content, title, canEdit, topics, topic, update, cancel }
  }
})
</script>
