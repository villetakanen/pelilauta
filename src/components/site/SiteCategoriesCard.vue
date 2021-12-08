<template>
  <Column class="siteCategoriesCard">
    <Card>
      <h1 class="title">
        {{ $t('site.meta.categories.title') }}
      </h1>

      <List>
        <ListItem
          v-for="(category, index) in site.pageCategories"
          :key="category.slug"
        >
          {{ category.name }}
          <template #action>
            <Icon
              v-if="index > 0"
              small
              name="move-up"
              @click="moveUp(index)"
            />
            <Button
              text
              @click.prevent="dropCategory(category.slug)"
            >
              <Icon
                xs
                name="delete"
              />
            </Button>
          </template>
        </ListItem>
      </List>
      <hr>
      <div class="flexList">
        <div style="flex-grow:1">
          <Textfield
            v-model="newCatName"
            :label="$t('site.meta.categories.newCategoryField')"
          />
        </div>
        <Button
          text
          @click.prevent="addCategory"
        >
          <Icon
            name="add"
            xs
          /> {{ $t('action.add') }}
        </Button>
      </div>
    </Card>
  </Column>
</template>

<script lang="ts">
import { useSite, updateSite } from '@/state/site'
import { toMekanismiURI } from '@/utils/contentFormat'
import { computed, defineComponent, ref } from 'vue'
import Card from '../layout/Card.vue'
import Icon from '../material/Icon.vue'
import Textfield from '../form/Textfield.vue'
import Column from '../layout/Column.vue'
import Button from '../form/Button.vue'
import List from '../material3/List.vue'
import ListItem from '../material3/ListItem.vue'

export default defineComponent({
  components: { Card, Textfield, Icon, Column, Button, List, ListItem },
  setup () {
    const newCatName = ref('')
    const newCatSlug = computed(() => (toMekanismiURI(newCatName.value)))
    const { site } = useSite()

    const dropCategory = async (slug: string) => {
      updateSite({
        id: site.value.id,
        pageCategories: site.value.pageCategories.filter((c) => (c.slug !== slug))
      })
    }

    const addCategory = async () => {
      updateSite({
        id: site.value.id,
        pageCategories: [
          ...site.value.pageCategories,
          { name: newCatName.value, slug: newCatSlug.value }
        ]
      })
    }

    const moveUp = (index: number) => {
      const newCategories = [...site.value.pageCategories]
      const tmp = newCategories[index]
      newCategories[index] = newCategories[index - 1]
      newCategories[index - 1] = tmp
      updateSite({
        id: site.value.id,
        pageCategories: newCategories
      })
    }

    return { addCategory, site, newCatName, newCatSlug, dropCategory, moveUp }
  }
})
</script>
