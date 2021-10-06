<template>
  <Card
    v-if="changes && changes.length > 0"
    :class="{
      dd: site.systemBadge === 'dd',
      quick: site.systemBadge === 'quick'
    }"
  >
    <h1 class="title">
      {{ site.name }}
    </h1>
    <p class="description">
      <em>{{ site.description }}</em>
    </p>
    <div class="log">
      <ul>
        <li
          v-for="log in changes"
          :key="log.changetime"
        >
          <router-link :to="`/site/${log.siteid}/page/${log.pageid}`">
            {{ log.name }} <br>
            <span class="TypeCaption">{{ toDisplayString(log.changetime) }}</span>
          </router-link>
        </li>
      </ul>
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
import { PageLogEntry } from '@/state/pagelog'
import { Site } from '@/state/site'
import { computed, defineComponent, PropType } from 'vue'
import Card from '../layout/Card.vue'
import Icon from '../material/Icon.vue'
import { toDisplayString } from '@/utils/firebaseTools'

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
    },
    pagelog: {
      type: Array as PropType<Array<PageLogEntry>>,
      required: true
    }
  },
  setup (props) {
    const changes = computed(() => {
      const arr = props.pagelog.filter((v) => (v.siteid === props.site.id))
      if (arr.length > 3) arr.length = 3
      return arr
    })
    return { changes, toDisplayString }
  }
})
</script>

<style lang="sass" scoped>
.card
  background-color: var(--chroma-secondary-d)
  width: 310px
  h1.title
    color: white
    padding-bottom: 8px
    color: var(--chroma-secondary-i)
  p.description
    background-color: var(--chroma-secondary-a)
    margin: 0 -16px
    padding: 16px
    color: var(--chroma-secondary-h)
  div.log
    background-color: var(--chroma-clear)
    margin: 0 -16px
    padding: 16px
    ul
      margin: 0
      padding: 0
    li
      list-style-type: none
      margin: 0
      padding: 4px 0
    li+li
      border-top: solid 1px var(--chroma-secondary-g)
      padding-top: 3px
.card.dd
  background-color: var(--color-ddb-red)
  p.description
    background-color: var(--color-ddb-sorcerer)
.card.quick
  background-color: #303030
  p.description
    background-color: black
.badge
  display: block
  margin: 8px auto
  text-align: center
</style>
