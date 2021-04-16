<template>
  <AdminActions :title="$t('admin.action.editorTest')" />
  <div class="contentGrid">
    <h3>Discussion/comment/reply Quill</h3>
    <ReplyEditor
      v-model:content="replyContent"
      style="border: solid 1px green; height: 96px;border-radius: 6px"
    />
    <p>The content is auto-processed to the field below</p>
    <Reply
      :reply="exampleReply"
      threadid="none"
    />
    <div class="test-container">
      <div class="test-box">
        <MaterialCard>
          <Editor
            v-model="content"
          />
          <QuillEditor
            v-model="content"
            :toolbar="true"
          />
        </MaterialCard>
        <MaterialButton :action="simulateSave">
          Simulate Save
        </MaterialButton>
      </div>
      <div class="test-box">
        <h3>This is what the end result looks like</h3>
        <MaterialCard class="rended-result">
          <div
            id="result"
            :innerHTML="content"
          />
          <div class="carousel">
            <img
              v-for="url in images.split(';')"
              :key="url"
              :src="url"
              alt=""
            >
          </div>
        </MaterialCard>
        <hr>
        {{ content }}
        <hr>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, ref } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import QuillEditor from '@/components/quill/QuillEditor.vue'
import { extractLinks, extractTags } from '@/utils/contentFormat'
import MaterialButton from '@/components/material/MaterialButton.vue'
import AdminActions from '@/components/admin/AdminActions.vue'
import ReplyEditor from '@/components/discussion/ReplyEditor.vue'
import { Reply as ReplyInterface } from '@/utils/firestoreInterfaces'
import Reply from '@/components/discussion/Reply.vue'

export default defineComponent({
  name: 'EditorTest',
  components: {
    MaterialCard,
    QuillEditor,
    MaterialButton,
    AdminActions,
    ReplyEditor,
    Reply
  },
  setup () {
    const content = ref('')
    const replyContent = ref('')
    const exampleReply:ComputedRef<ReplyInterface> = computed(() => ({
      content: replyContent.value,
      replyid: 'demo',
      author: 'YN8dQz3H8OMsb0L4jImAlROPQpo1'
    }))

    const images = ref('')

    const simulateSave = () => {
      const { formattedContent: fc1, tags } = extractTags(content.value)
      const { formattedContent } = extractLinks(fc1)
      content.value = formattedContent
      console.log(tags)
    }

    return { content, images, simulateSave, replyContent, exampleReply }
  }
})
</script>

<style lang="sass" scoped>
.test-container
  display: flex
  flex-basis: 400px
  .test-box
    width: 400px
    flex-flow: 0
    flex-shrink: 0

.carousel
  display: flex
  img
    max-width: 40px
    max-height: 40px
    padding: 1px
    margin-right: 1px
</style>
