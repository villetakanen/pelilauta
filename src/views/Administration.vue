<template>
  <AdminActions :title="$t('admin.title')" />
  <div class="contentGrid">
    <MaterialCard>
      <UserList />
    </MaterialCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import UserList from '@/components/UserList.vue'
import AdminActions from '@/components/admin/AdminActions.vue'

export default defineComponent({
  name: 'Admin',
  components: {
    UserList,
    MaterialCard,
    AdminActions
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
