<template>
  <ViewHeader>
    {{ $t('admin.title') }}
  </ViewHeader>
  <div class="contentGrid">
    <MaterialCard>
      <UserList />
    </MaterialCard>
    <MaterialCard>
      <h1>Testing tools</h1>
      <p>
        <router-link to="/editortest">
          Editor testing page.
        </router-link>
      </p>
      <p>
        <a @click="dialog=!dialog">Show Dialog</a>
      </p>
    </MaterialCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import ViewHeader from '@/components/app/ViewHeader.vue'
import UserList from '@/components/UserList.vue'

export default defineComponent({
  name: 'Admin',
  components: {
    UserList,
    MaterialCard,
    ViewHeader
  },
  setup () {
    const dialog = ref(false)
    return { dialog }
  }
})
</script>

<style lang="sass" scoped>
#app div.material-card h1
  margin-bottom: 16px
</style>
