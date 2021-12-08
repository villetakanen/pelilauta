<template>
  <Column
    id="sideBar"
  >
    <section class="contentBox chroma-box-1">
      <h1 class="title">
        <router-link :to="`/site/${site.id}/page/${site.id}`">
          {{ site.name }}
        </router-link>
      </h1>
      <p><em>{{ site.description }}</em></p>
      <img
        v-if="site.splashURL"
        class="sitePoster"
        alt="Site splash image"
        :src="site.splashURL"
        style="margin-top: 8px"
      >
      <template v-if="!site.hasCategories()">
        <h3>{{ $t('site.sidebar.index.title') }}</h3>
        <ul class="index">
          <li
            v-for="page in pages"
            :key="page.id"
          >
            <router-link :to="`/site/${site.id}/page/${page.id}`">
              {{ page.name }}
            </router-link>
          </li>
        </ul>
      </template>
      <template v-if="site.hasCategories()">
        <h4>{{ $t('site.sidebar.index.title') }}</h4>
        <ul class="index">
          <li
            v-for="page in noCategory"
            :key="page.id"
          >
            <router-link :to="`/site/${site.id}/page/${page.id}`">
              {{ page.name }}
            </router-link>
          </li>
        </ul>
        <div
          v-for="cat in site.pageCategories"
          :key="cat.slug"
          class="category"
        >
          {{ cat.name }}
          <ul class="index">
            <li
              v-for="page in inTopic(cat)"
              :key="page.id"
            >
              <router-link :to="`/site/${site.id}/page/${page.id}`">
                {{ page.name }}
              </router-link>
            </li>
          </ul>
        </div>
      </template>
      <Icon
        :name="site.system + '-logo'"
        dark
        style="margin: 16px auto 0px auto; display: block;"
      />
    </section>
  </Column>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { usePages, useSite } from '@/state/site'
import Column from '../layout/Column.vue'
import Icon from '../material/Icon.vue'

export default defineComponent({
  name: 'SideBar',
  components: { Column, Icon },
  setup () {
    const { site } = useSite()
    const { pages } = usePages()

    function inTopic (topic: { slug: string, name: string}) {
      return pages.value.filter((a) => (a.category === topic.slug))
    }

    const noCategory = computed(() => (pages.value.filter((a) => (!site.value.pageCategories.find((c) => (c.slug === a.category))))))

    return { site, pages, inTopic, noCategory }
  }
})
</script>

<style lang="sass" scoped>
#sideBar
  section
    padding: 16px
  ul
    margin: 0
    padding: 0
    padding-left: var(--grid-gap)
    margin-bottom: 12px
    li
      list-style-type: none

.contentBox
  img.sitePoster
    max-width: calc(100% + 32px)
    width: calc(100% + 32px)
    margin: 0 -16px

</style>
