<template>
  <Card
    v-if="changes && changes.length > 0"
    :class="{
      dd: site.system === 'dd',
      quick: site.system === 'quick'
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
        :name="site.system + '-logo'"
        dark
        medium
        class="badge"
      />
    </div>
  </Card>
</template>

<script lang="ts">
import { usePagelog } from '@/state/pagelog'
import { Site } from '@/state/site/Site'
import { computed, defineComponent } from 'vue'
import Card from '../layout/Card.vue'
import Icon from '../material/Icon.vue'
import { toDisplayString } from '@/utils/firebaseTools'
import { useSites } from '@/state/sites'

export default defineComponent({
  name: 'WikiIndex',
  components: {
    Card,
    Icon
  },
  props: {
    siteid: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { publicSites, userSites } = useSites()
    const { recent } = usePagelog()

    const site = computed(() => {
      return [...publicSites.value, ...userSites.value].find(s => s.id === props.siteid) || new Site()
    })

    const changes = computed(() => {
      const arr = recent.value.filter((v) => (v.siteid === props.siteid))
      if (arr.length > 3) arr.length = 3
      return arr
    })
    return { changes, toDisplayString, site }
  }
})
</script>

<style lang="sass" scoped>
.card
  background-color: var(--chroma-secondary-d)
  width: 310px
  h1.title
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
