<template>
  <Card class="siteCategoriesCard">
    <h1 class="title">
      {{ $t('site.meta.categories.title') }}
    </h1>
    <div
      v-for="cat in site.categories"
      :key="cat.slug"
    >
      {{ cat.name }} <MaterialButton
        icon
        @click="dropCategory(cat.slug)"
      >
        <Icon name="delete" />
      </MaterialButton>
    </div>
    <div class="toolbar">
      <div style="flex-grow:1">
        <Textfield
          v-model="newCatName"
          :label="$t('site.meta.categories.newCategoryField')"
        />
        <span class="caption">{{ newCatSlug }}</span>
      </div>
      <MaterialButton
        icon
        :async-action="addCategory"
      >
        <Icon name="add" />
      </MaterialButton>
    </div>
  </Card>
</template>

<script lang="ts">
import { useSite, updateSite } from '@/state/site'
import { PageCategory } from '@/state/site/pagecategory'
import { toMekanismiURI } from '@/utils/contentFormat'
import { computed, defineComponent, ref } from 'vue'
import Card from '../layout/Card.vue'
import Icon from '../material/Icon.vue'
import MaterialButton from '../material/MaterialButton.vue'
import Textfield from '../form/Textfield.vue'

export default defineComponent({
  components: { Card, Textfield, MaterialButton, Icon },
  setup () {
    const newCatName = ref('')
    const newCatSlug = computed(() => (toMekanismiURI(newCatName.value)))
    const { site } = useSite()

    const dropCategory = async (slug: string) => {
      updateSite({
        id: site.value.id,
        categories: site.value.categories.filter((c) => (c.slug !== slug))
      })
    }

    const addCategory = async () => {
      updateSite({
        id: site.value.id,
        categories: [...site.value.categories, new PageCategory(newCatName.value)]
      })
    }

    return { addCategory, site, newCatName, newCatSlug, dropCategory }
  }
})
</script>
