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
    <p>
      <a @click="dialog=!dialog">Show Dialog</a>
    </p>
  </MaterialCard>
  <Dialog v-model="dialog">
    <MaterialCard>
      <h1>Dialog!</h1>
      <p>Hmm, it seems your account is frozen? Maybe you should contact the admins for more info.</p>
    </MaterialCard>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import MaterialCard from '@/components/material/MaterialCard.vue'
import Dialog from '@/components/material/Dialog.vue'
import UserList from '@/components/UserList.vue'

export default defineComponent({
  name: 'Admin',
  components: {
    MaterialCard,
    UserList,
    Dialog
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
