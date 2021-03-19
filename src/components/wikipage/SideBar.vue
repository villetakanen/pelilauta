<template>
  <div
    class="sidebar contentBox"
    style="position: relative"
  >
    <transition name="fade">
      <div v-if="site">
        <h3 style="margin: 0">
          <router-link :to="`/mekanismi/view/${site.id}/${site.id}`">
            {{ site.name }}
          </router-link>
        </h3>
        <p><em>{{ site.description }}</em></p>
        <img
          v-if="site.splashURL"
          class="cardPoster"
          alt="Site splash image"
          :src="site.splashURL"
          style="margin-top: 8px"
        >
        <h3>{{ $t('mekanismi.sidebar.pagelist') }}</h3>
        <ul>
          <li
            v-for="page in pages"
            :key="page.id"
          >
            <router-link :to="`/mekanismi/view/${site.id}/${page.id}`">
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
import { usePages, useSite } from '@/state/site'

export default defineComponent({
  name: 'WikiSideBar',
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
