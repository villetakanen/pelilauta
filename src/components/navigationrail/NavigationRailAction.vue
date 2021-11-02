<template>
  <div
    class="NavigationRailAction"
    :class="{ active: active }"
    @click="router.push({ name: routeName })"
  >
    <div class="railIconHolder">
      <Icon
        small
        dark
        :name="icon"
        class="railIcon"
      />
    </div>
    <div
      v-if="name"
      class="name TypeCaption"
    >
      {{ name }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Icon from '../material/Icon.vue'

export default defineComponent({
  name: 'NavigationRailAction',
  components: { Icon },
  props: {
    routeName: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup (props) {
    const route = useRoute()
    const router = useRouter()
    const active = computed(() => (route.name === props.routeName))
    return { active, router }
  }
})
</script>

<style lang="sass" scoped>
.NavigationRailAction
  width: 80px
  margin: 0
  padding: 0
  .railIconHolder
    margin: 4px 12px
    padding: 2px 16px
    border-radius: 12px
    transition: all 0.3s
    &:hover
      background-color: rgba(#fff, 0.11)
  .name
    color: var(--chroma-secondary-h)
    text-align: center
    width: 64px
    margin: 8px
  &.active
    .railIconHolder
      background-color: rgba(#fff, 0.22)

</style>
