<template>
  <AdminActions :title="$t('admin.title')" />
  <div class="emptyLayout">
    <UserList />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from 'vue'
import UserList from '@/components/UserList.vue'
import AdminActions from '@/components/admin/AdminActions.vue'
import { useAuth } from '@/state/authz'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Admin',
  components: {
    UserList,
    AdminActions
  },
  setup () {
    const { loginComplete, showAdminTools } = useAuth()
    const router = useRouter()

    onMounted(() => {
      watch(loginComplete, (val) => {
        if (val && !showAdminTools.value) router.push('/mekanismi')
      })
    })

    return { showAdminTools }
  }
})
</script>

<style lang="sass" scoped>
#app div.material-card h1
  margin-bottom: 16px
</style>
