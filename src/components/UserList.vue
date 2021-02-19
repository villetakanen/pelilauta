<template>
  <div class="userlist">
    <table>
      <caption>User Admin</caption>
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
      <tr
        v-for="user in users"
        :key="user.uid"
      >
        <UserListRow
          :nick="user.nick"
          :uid="user.uid"
          :photo="user.photoURL"
        />
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import UserListRow from '@/components/UserListRow.vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { useAuthState } from '@/state/authz'

interface UserListEntity {
  uid: string;
  nick: string;
  isMe: boolean;
  photoURL: string;
}

export default defineComponent({
  name: 'EditPost',
  components: {
    UserListRow
  },
  setup () {
    const users = ref(new Array<UserListEntity>())
    const { uid } = useAuthState()

    onMounted(() => {
      const db = firebase.firestore()
      const profilesRef = db.collection('profiles')
      profilesRef.onSnapshot((changes) => {
        changes.docChanges().forEach((change) => {
          if (change.type === 'added') {
            users.value.push({
              uid: change.doc.id,
              nick: change.doc.data()?.nick,
              isMe: change.doc.id === uid.value,
              photoURL: change.doc.data()?.photoURL
            })
          }
        })
      })
    })

    return { users }
  }
})
</script>

<style lang="sass" scoped>
.userlist
  table
    width: 100%
    border-collapse: collapse
    margin-bottom: 16px
  td
    border-bottom: solid 1px #ddd
.avatar
  height: 22px
  width: 22px
  border-radius: 11px
.admin
  color: red
.myself
  color: #666
</style>
