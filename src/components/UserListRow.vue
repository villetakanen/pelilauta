<template>
  <td>
    <img
      v-if="photo"
      :src="photo"
      class="avatar"
    >
  </td>
  <td
    style="padding: 0 8px"
    :class="isAdmin(uid) ? 'admin ' : ' '"
  >
    {{ nick }}
  </td>
  <td>
    <MaterialButton
      v-if="!isMe && !isAdmin(uid)"
      text
      :action="elevate"
    >
      Make admin
    </MaterialButton>
    <MaterialButton
      v-if="!isMe && isAdmin(uid)"
      text
      style="color: red"
      :action="revoke"
    >
      Revoke
    </MaterialButton>
  </td>
  <td>
    <MaterialButton
      v-if="!isMe && !isAdmin(uid)"
      text
    >
      Freeze
    </MaterialButton>
  </td>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
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
  props: {
    nick: {
      type: String,
      required: true
    },
    uid: {
      type: String,
      required: true
    },
    photo: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup (props) {
    const { isAdmin } = useMeta()
    const { uid: activeUid } = useAuthz()
    const isMe = computed(() => (props.uid === activeUid.value))

    const revoke = () => {
      const db = firebase.firestore()
      const metaRef = db.collection('meta').doc('pelilauta')
      metaRef.get().then((meta) => {
        if (meta.exists) {
          let admins: string[] = meta.data()?.admins
          if (admins) {
            admins = admins.filter((admin) => (admin !== props.uid))
          }
          if (admins.length > 0) metaRef.update({ admins: admins })
        }
      })
    }
    const elevate = () => {
      const db = firebase.firestore()
      const metaRef = db.collection('meta').doc('pelilauta')
      metaRef.get().then((meta) => {
        if (meta.exists) {
          const admins: string[] = meta.data()?.admins
          if (admins) {
            admins.push(props.uid)
          }
          if (admins.length > 0) metaRef.update({ admins: admins })
        }
      })
    }

    return { isMe, isAdmin, revoke, elevate }
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
