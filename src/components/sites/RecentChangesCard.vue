<template>
  <Card
    :class="{
      dd: site.systemBadge === 'dd',
      quick: site.systemBadge === 'quick'
    }"
  >
    <h1 class="title">
      {{ site.name }}
    </h1>
    <p>{{ site.systemBadge }}</p>
    <p class="description">
      {{ site.description }}
    </p>
    <div>
      {{ changes }}
    </div>
    <div class="badge">
      <Icon
        :name="site.systemBadge + '-logo'"
        dark
        headline
        class="badge"
      />
    </div>
  </Card>
</template>

<script lang="ts">
import { usePagelog } from '@/state/pagelog'
import { Site } from '@/state/site'
import { computed, defineComponent, PropType } from 'vue'
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
    const { recent } = usePagelog()
    const changes = computed(() => (recent.value.filter((v) => (v.siteid === props.site.id))))
    return { changes }
  }
})
</script>

<style lang="sass" scoped>
.card
  background-color: var(--chroma-secondary-d)
  h1.title
    color: white
  p.description
    background-color: var(--chroma-secondary-a)
    margin: 0 -16px
    padding: 16px
    color: white
.card.dd
  background-color: var(--color-ddb-red)
  p.description
    background-color: var(--color-ddb-sorcerer)
.card.quick
  background-color: #303030
  background: linear-gradient(-11deg, #303030 0%, var(--chroma-secondary-c) 100%)
  p.description
    background-color: #303030
.badge
  display: block
  margin: 8px auto
  text-align: center
</style>
