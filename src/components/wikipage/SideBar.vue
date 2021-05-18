<template>
  <div
    class="sidebar contentBox"
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
        <template v-if="!site.hasCategories">
          <h3>{{ $t('mekanismi.sidebar.pagelist') }}</h3>
          <ul class="index">
            <li
              v-for="page in pages"
              :key="page.id"
            >
              <router-link :to="`/mekanismi/view/${site.id}/${page.id}`">
                {{ page.name }}
              </router-link>
            </li>
          </ul>
        </template>
        <template v-if="site.hasCategories">
          <h3>{{ $t('mekanismi.sidebar.pagelist') }}</h3>
          <ul class="index">
            <li
              v-for="page in noCategory"
              :key="page.id"
            >
              <router-link :to="`/mekanismi/view/${site.id}/${page.id}`">
                {{ page.name }}
              </router-link>
            </li>
          </ul>
          <div
            v-for="cat in site.categories"
            :key="cat.slug"
            class="category"
          >
            {{ cat.name }}
            <ul class="index">
              <li
                v-for="page in inTopic(cat)"
                :key="page.id"
              >
                <router-link :to="`/mekanismi/view/${site.id}/${page.id}`">
                  {{ page.name }}
                </router-link>
              </li>
            </ul>
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
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

    function inTopic (topic: { slug: string, name: string}) {
      return pages.value.filter((a) => (a.category === topic.slug))
    }

    const noCategory = computed(() => (pages.value.filter((a) => (!site.value.categories.find((c) => (c.slug === a.category))))))

    return { toggle, open, site, pages, inTopic, noCategory }
  }
})
</script>

<style lang="sass" scoped>
.sidebar
  position: relative
  .index
    a
      text-decoration: none
      color: var(--chroma-secondary-c)

</style>
