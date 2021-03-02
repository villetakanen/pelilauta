<template>
  <MaterialCard class="recentChangesCard">
    <h1>{{ $t('wiki.changesCard.title') }}</h1>
    <ul>
      <li
        v-for="item in recent"
        :key="item.changetime"
      >
        <span class="siteslug">{{ item.siteid }}</span>
        <router-link :to="`/mekanismi/view/${item.siteid}/${item.pageid}`">
          {{ item.name }}
        </router-link>
      </li>
    </ul>
  </MaterialCard>
</template>

<script lang="ts">
import { PageLogEntry, usePagelog } from '@/state/pagelog'
import { defineComponent, ref } from 'vue'
import MaterialCard from '../material/MaterialCard.vue'

export default defineComponent({
  components: { MaterialCard },
  setup () {
    const { fetchPagelog } = usePagelog()
    const recent = ref(new Array<PageLogEntry>())
    fetchPagelog().then((log) => {
      recent.value = log
    })
    return { recent }
  }
})
</script>

<style lang="sass" scoped>
@import @/styles/material-colors.sass
@import @/styles/material-typography.sass

.siteslug
  color: $color-font-disabled
  padding-right: 8px

</style>
