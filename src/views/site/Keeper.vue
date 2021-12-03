<template>
  <div class="keeper">
    <SiteToolbar />
    <main class="bookLayout">
      <CharacterList class="double" />
      <SitePlayesTool class="single" />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from 'vue'
import { useSite } from '@/state/site'
import SiteToolbar from '@/components/site/header/SiteToolbar.vue'
import CharacterList from '@/components/keeper/CharacterList.vue'
import SitePlayesTool from '@/components/keeper/SitePlayesTool.vue'

export default defineComponent({
  name: 'WikiIndex',
  components: {
    SiteToolbar,
    CharacterList,
    SitePlayesTool
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
  }
})
</script>
