<template>
  <AdminActions :title="$t('admin.action.editorTest')" />
  <div class="contentGrid">
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
import { defineComponent, ref } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import QuillEditor from '@/components/quill/QuillEditor.vue'
import { extractLinks, extractTags } from '@/utils/contentFormat'
import MaterialButton from '@/components/material/MaterialButton.vue'
import AdminActions from '@/components/admin/AdminActions.vue'

export default defineComponent({
  name: 'EditorTest',
  components: {
    MaterialCard,
    QuillEditor,
    MaterialButton,
    AdminActions
  },
  setup () {
    const content = ref('')

    const images = ref('')

    const simulateSave = () => {
      const { formattedContent: fc1, tags } = extractTags(content.value)
      const { formattedContent } = extractLinks(fc1)
      content.value = formattedContent
      console.log(tags)
    }

    return { content, images, simulateSave }
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
