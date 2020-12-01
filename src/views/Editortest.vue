<template>
  <ViewHeader>EDITOR PLAYGROUND</ViewHeader>
  <div class="contentGrid">
    <div class="test-container">
      <div class="test-box">
        <MaterialCard>
          <Editor
            v-model="content"
            @new-images="addImages"
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
import Editor from '@/components/editor/Editor2.vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import ViewHeader from '@/components/app/ViewHeader.vue'
import QuillEditor from '@/components/quill/QuillEditor.vue'
import { PostImage } from '@/lib/stream'
import { extractTags } from '@/utils/contentFormat'
import MaterialButton from '@/components/material/MaterialButton.vue'

export default defineComponent({
  name: 'EditorTest',
  components: {
    Editor,
    MaterialCard,
    ViewHeader,
    QuillEditor,
    MaterialButton
  },
  setup () {
    const content = ref('')

    const images = ref('')

    const addImages = (attrs: PostImage[]) => {
      // eslint-disable-next-line
      console.log(attrs)
    }

    const simulateSave = () => {
      const { formattedContent, tags } = extractTags(content.value)
      content.value = formattedContent
      console.log(tags)
    }

    return { content, images, addImages, simulateSave }
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
    flex-flex-shrink: 0

.carousel
  display: flex
  img
    max-width: 40px
    max-height: 40px
    padding: 1px
    margin-right: 1px
</style>
