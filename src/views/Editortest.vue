<template>
  <AdminActions :title="$t('rtesandbox.title')" />
  <main class="bookLayout">
    <ReplyEditorTester />
    <RichTextEditorTester />
  </main>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, ref } from 'vue'
import { extractLinks, extractTags } from '@/utils/contentFormat'
import AdminActions from '@/components/admin/AdminActions.vue'
import { Reply as ReplyInterface } from '@/utils/firestoreInterfaces'
import ReplyEditorTester from '@/components/discussion/ReplyEditorTester.vue'
import RichTextEditorTester from '@/components/quill/RichTextEditorTester.vue'
import { useAuthors } from '@/state/authors'

export default defineComponent({
  name: 'EditorTest',
  components: {
    AdminActions,
    ReplyEditorTester,
    RichTextEditorTester
  },
  setup () {
    const content = ref('')
    const replyContent = ref('')
    const exampleReply:ComputedRef<ReplyInterface> = computed(() => ({
      content: replyContent.value,
      replyid: 'demo',
      author: 'YN8dQz3H8OMsb0L4jImAlROPQpo1'
    }))

    const { subscribeToAuthors } = useAuthors()
    subscribeToAuthors()

    const images = ref('')

    const simulateSave = () => {
      const { formattedContent: fc1 } = extractTags(content.value)
      const { formattedContent } = extractLinks(fc1)
      content.value = formattedContent
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
