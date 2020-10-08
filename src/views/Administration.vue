<template>
  <MaterialCard>
    <h1>Admin</h1>
    <UserList />
    <h1>Testing tools</h1>
    <p>
      <router-link to="/editortest">
        Editor testing page.
      </router-link>
    </p>
  </MaterialCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import UserList from '@/components/UserList.vue'

export default defineComponent({
  name: 'Admin',
  components: {
    MaterialCard,
    UserList
  }
})
</script>

<style lang="sass" scoped>
#app div.material-card h1
  margin-bottom: 16px
</style>
