<template>
  <div
    class="sidebar"
    style="position: relative"
  >
    <MaterialButton
      :action="toggle"
      :icon="true"
      style="position:absolute;right:-8px;top:-8px"
    >
      x
    </MaterialButton>
    <transition name="fade">
      <div v-if="site">
        <h1>{{ site.name }}</h1>
        <p><em>{{ site.description }}</em></p>
        <h2>{{ $t('mekanismi.sidebar.pagelist') }}</h2>
        <ul>
          <li
            v-for="page in pages"
            :key="page.id"
          >
            <router-link :to="`/mekanismi/view/${site.siteid}/${page.id}`">
              {{ page.name }}
            </router-link>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import { usePages, useSite } from '@/state/site'

export default defineComponent({
  name: 'WikiSideBar',
  components: {
    MaterialButton
  },
  props: {
    modelValue: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    const { site } = useSite()
    const { pages } = usePages()
    const open = ref(props.modelValue)
    function toggle () {
      open.value = !open.value
      context.emit('update:modelValue', open.value)
    }
    return { toggle, open, site, pages }
  }
})
</script>
