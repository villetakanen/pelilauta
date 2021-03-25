<template>
  <div class="imageUploadPane">
    <input
      ref="uploader"
      class="uploadButton"
      type="file"
    >
  </div>
</template>

<script lang="ts">
import { ComponentPublicInstance, defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  name: 'AddAssetView',
  props: {
    siteid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const uploader = ref<ComponentPublicInstance<HTMLInputElement>>()

    onMounted(() => {
      console.log(uploader.value)
    })

    return { uploader }
  }
})
</script>
