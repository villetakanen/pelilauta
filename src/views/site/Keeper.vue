<template>
  <div class="keeper">
    <SiteToolbar />
    <div class="flexLayout">
      <div
        v-for="c in siteCharacters"
        :key="c[0]"
        class="flex-span-1"
      >
        <h4>{{ c[1].name }}</h4>
        <div :innerHTML="c[1].htmlContent" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from 'vue'
import { useSite, useSiteCharacters } from '@/state/site'
import SiteToolbar from '@/components/site/header/SiteToolbar.vue'

export default defineComponent({
  name: 'WikiIndex',
  components: {
    SiteToolbar
  },
  props: {
    siteid: {
      type: String,
      required: true
    },
    pageid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    onMounted(() => {
      watch(() => props.siteid, (siteid) => {
        useSite(siteid)
      }, { immediate: true })
    })
    const { site } = useSite()
    const { siteCharacters } = useSiteCharacters()
    return { site, siteCharacters }
  }
})
</script>
