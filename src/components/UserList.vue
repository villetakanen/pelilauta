<template>
  <div class="userlist">
    <table>
      <tr
        v-for="user in users"
        :key="user.uid"
      >
        <td>
          <img
            v-if="user.photoURL"
            :src="user.photoURL"
            class="avatar"
          >
        </td>
        <td style="padding: 0 8px" :class="isAdmin(user.uid) ? 'admin ' : ' '">
          {{ user.nick }}
        </td>
        <td>
          <MaterialButton
            v-if="!user.isMe && !isAdmin(user.uid)"
            text
          >
            Make admin
          </MaterialButton>
          <MaterialButton
            v-if="!user.isMe && isAdmin(user.uid)"
            text
            style="color: red"
          >
            Revoke
          </MaterialButton>
        </td>
        <td>
          <MaterialButton
            v-if="!user.isMe && !isAdmin(user.uid)"
            text
          >
            Freeze
          </MaterialButton>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import MaterialButton from '@/components/material/MaterialButton.vue'
import { useMeta } from '@/lib/meta'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import { useAuthz } from '@/lib/authz'

interface UserListEntity {
  uid: string;
  nick: string;
  isMe: boolean;
  photoURL: string;
}

export default defineComponent({
  name: 'EditPost',
  components: {
    MaterialButton
  },
  setup () {
    const users = ref(new Array<UserListEntity>())
    const { isAdmin } = useMeta()
    const { uid } = useAuthz()

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

    return { users, isAdmin }
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
