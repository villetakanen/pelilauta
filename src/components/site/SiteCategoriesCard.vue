<template>
  <Card class="siteCategoriesCard">
    <h1 class="title">
      {{ $t('site.meta.categories.title') }}
    </h1>
    <div
      v-for="cat in site.categories"
      :key="cat.slug"
    >
      {{ cat.name }}
    </div>
    <div class="toolbar">
      <div style="flex-grow:1">
        <TextField
          v-model="newCatName"
          :label="$t('site.meta.categories.newCategoryField')"
        />
        <span class="caption">{{ newCatSlug }}</span>
      </div>
      <MaterialButton icon>
        <Icon name="add" />
      </MaterialButton>
    </div>
  </Card>
</template>

<script lang="ts">
import { useSite } from '@/state/site'
import { toMekanismiURI } from '@/utils/contentFormat'
import { computed, defineComponent, ref } from 'vue'
import Card from '../layout/Card.vue'
import Icon from '../material/Icon.vue'
import MaterialButton from '../material/MaterialButton.vue'
import TextField from '../material/TextField.vue'

export default defineComponent({
  components: { Card, TextField, MaterialButton, Icon },
  setup () {
    const newCatName = ref('')
    const newCatSlug = computed(() => (toMekanismiURI(newCatName.value)))
    const { site } = useSite()
    return { site, newCatName, newCatSlug }
  }
})
</script>
