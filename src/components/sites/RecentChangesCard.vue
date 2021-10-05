<template>
  <Card
    :class="{
      dd: site.systemBadge === 'dd'
    }"
  >
    <h1 class="title">
      {{ site.name }}
    </h1>
    <p>{{ site.systemBadge }}</p>
    <Icon
      :name="site.systemBadge + '-logo'"
      dark
      headline
      class="badge"
    />
  </Card>
</template>

<script lang="ts">
import { Site } from '@/state/site'
import { defineComponent, PropType } from 'vue'
import Card from '../layout/Card.vue'
import Icon from '../material/Icon.vue'

export default defineComponent({
  name: 'WikiIndex',
  components: {
    Card,
    Icon
  },
  props: {
    site: {
      type: Object as PropType<Site>,
      required: true
    }
  },
  setup (props) {
  }
})
</script>

<style lang="sass" scoped>
.card.dd
  background-color: var(--color-ddb-red)
</style>
