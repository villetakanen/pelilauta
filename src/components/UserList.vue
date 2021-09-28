<template>
  <Column class="userlist">
    <table>
      <caption>User Admin</caption>
      <thead>
        <tr>
          <th scope="col">
            Avatar
          </th>
          <th scope="col">
            Author
          </th>
          <th scope="col">
            State
          </th>
        </tr>
      </thead>
      <tr
        v-for="user in authors"
        :key="user.uid"
      >
        <UserListRow
          :nick="user.nick"
          :uid="user.uid"
          :photo="user.photoURL"
        />
      </tr>
    </table>
  </Column>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import UserListRow from '@/components/UserListRow.vue'
import Column from './layout/Column.vue'
import { useAuthors } from '@/state/authors'

export default defineComponent({
  name: 'EditPost',
  components: {
    UserListRow,
    Column
  },
  setup () {
    const { authors } = useAuthors()
    return { authors }
  }
})
</script>

<style lang="sass" scoped>
.userlist
  table
    width: 100%
</style>
