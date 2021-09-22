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
import { defineComponent } from 'vue'
import { useSite, useSiteCharacters } from '@/state/site'
import SiteToolbar from '@/components/sites/SiteToolbar.vue'

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
    const { site } = useSite(props.siteid)
    const { siteCharacters } = useSiteCharacters()
    return { site, siteCharacters }
  }
})
</script>
